-- The Poradas Wedding Website - Database Schema
-- PostgreSQL 17.6
-- Database: theporadas_dev

-- ============================================
-- SETUP: Extensions and Types
-- ============================================

-- Enable UUID extension for unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS if you want geographic data (optional)
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================
-- TABLE: guests
-- ============================================
CREATE TABLE IF NOT EXISTS guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    dietary_restrictions TEXT,
    plus_one_allowed BOOLEAN DEFAULT FALSE,
    plus_one_name VARCHAR(200),
    group_id UUID, -- For families/groups attending together
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_guests_email ON guests(email);

-- Index for group queries
CREATE INDEX IF NOT EXISTS idx_guests_group_id ON guests(group_id);

-- ============================================
-- TABLE: rsvps
-- ============================================
CREATE TABLE IF NOT EXISTS rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    attending BOOLEAN NOT NULL,
    ceremony BOOLEAN DEFAULT TRUE, -- Attending ceremony
    reception BOOLEAN DEFAULT TRUE, -- Attending reception
    song_request VARCHAR(500), -- Song they'd like to hear
    message TEXT, -- Personal message to couple
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_guest FOREIGN KEY (guest_id) REFERENCES guests(id)
);

-- Index for guest lookups
CREATE INDEX IF NOT EXISTS idx_rsvps_guest_id ON rsvps(guest_id);

-- Index for attendance queries
CREATE INDEX IF NOT EXISTS idx_rsvps_attending ON rsvps(attending);

-- Index for submission time
CREATE INDEX IF NOT EXISTS idx_rsvps_submitted_at ON rsvps(submitted_at DESC);

-- ============================================
-- TABLE: photos
-- ============================================
CREATE TABLE IF NOT EXISTS photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uploaded_by_guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
    uploaded_by_name VARCHAR(200) NOT NULL, -- In case not a registered guest
    firebase_storage_path TEXT NOT NULL, -- Path in Firebase Storage
    firebase_storage_url TEXT NOT NULL, -- Public URL
    thumbnail_url TEXT, -- Optimized thumbnail URL
    file_name VARCHAR(500) NOT NULL,
    file_size BIGINT, -- Size in bytes
    mime_type VARCHAR(100),
    width INTEGER,
    height INTEGER,
    taken_at TIMESTAMP WITH TIME ZONE, -- When photo was taken (EXIF)
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved BOOLEAN DEFAULT FALSE, -- Moderation flag
    featured BOOLEAN DEFAULT FALSE, -- Highlight special photos
    caption TEXT,
    tags TEXT[], -- Array of tags for searching
    likes_count INTEGER DEFAULT 0,
    CONSTRAINT fk_uploaded_by_guest FOREIGN KEY (uploaded_by_guest_id) REFERENCES guests(id)
);

-- Index for uploader queries
CREATE INDEX IF NOT EXISTS idx_photos_uploaded_by ON photos(uploaded_by_guest_id);

-- Index for approval status
CREATE INDEX IF NOT EXISTS idx_photos_approved ON photos(approved);

-- Index for featured photos
CREATE INDEX IF NOT EXISTS idx_photos_featured ON photos(featured);

-- Index for upload time
CREATE INDEX IF NOT EXISTS idx_photos_uploaded_at ON photos(uploaded_at DESC);

-- Index for tags (GIN index for array searches)
CREATE INDEX IF NOT EXISTS idx_photos_tags ON photos USING GIN(tags);

-- ============================================
-- TABLE: photo_likes
-- ============================================
CREATE TABLE IF NOT EXISTS photo_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    photo_id UUID NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
    liked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_photo FOREIGN KEY (photo_id) REFERENCES photos(id),
    CONSTRAINT fk_guest_like FOREIGN KEY (guest_id) REFERENCES guests(id),
    UNIQUE(photo_id, guest_id) -- Prevent duplicate likes
);

-- Index for photo likes queries
CREATE INDEX IF NOT EXISTS idx_photo_likes_photo_id ON photo_likes(photo_id);

-- Index for guest likes queries
CREATE INDEX IF NOT EXISTS idx_photo_likes_guest_id ON photo_likes(guest_id);

-- ============================================
-- TABLE: event_timeline
-- ============================================
CREATE TABLE IF NOT EXISTS event_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    location VARCHAR(300),
    location_lat DECIMAL(10, 8), -- Latitude for map
    location_lng DECIMAL(11, 8), -- Longitude for map
    event_type VARCHAR(50), -- ceremony, reception, rehearsal, etc.
    display_order INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for date ordering
CREATE INDEX IF NOT EXISTS idx_event_timeline_date ON event_timeline(event_date, event_time);

-- Index for display order
CREATE INDEX IF NOT EXISTS idx_event_timeline_order ON event_timeline(display_order);

-- ============================================
-- TABLE: admin_users
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firebase_uid VARCHAR(128) UNIQUE NOT NULL, -- Firebase Auth UID
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'admin', -- admin, moderator
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Index for Firebase UID lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_firebase_uid ON admin_users(firebase_uid);

-- ============================================
-- TRIGGERS: Auto-update timestamps
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for guests table
CREATE TRIGGER update_guests_updated_at
    BEFORE UPDATE ON guests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for rsvps table
CREATE TRIGGER update_rsvps_updated_at
    BEFORE UPDATE ON rsvps
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TRIGGERS: Photo likes counter
-- ============================================

-- Function to increment likes count
CREATE OR REPLACE FUNCTION increment_photo_likes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE photos SET likes_count = likes_count + 1 WHERE id = NEW.photo_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement likes count
CREATE OR REPLACE FUNCTION decrement_photo_likes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE photos SET likes_count = likes_count - 1 WHERE id = OLD.photo_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger for like additions
CREATE TRIGGER photo_like_added
    AFTER INSERT ON photo_likes
    FOR EACH ROW
    EXECUTE FUNCTION increment_photo_likes();

-- Trigger for like removals
CREATE TRIGGER photo_like_removed
    AFTER DELETE ON photo_likes
    FOR EACH ROW
    EXECUTE FUNCTION decrement_photo_likes();

-- ============================================
-- SAMPLE DATA (Optional - for development)
-- ============================================

-- Insert admin users (replace with your Firebase UID)
INSERT INTO admin_users (firebase_uid, email, role)
VALUES 
    ('REPLACE_WITH_FIREBASE_UID', 'austin@theporadas.com', 'admin')
ON CONFLICT (firebase_uid) DO NOTHING;

-- Insert sample guests (for testing)
INSERT INTO guests (email, first_name, last_name, plus_one_allowed, group_id)
VALUES 
    ('guest1@example.com', 'John', 'Doe', true, uuid_generate_v4()),
    ('guest2@example.com', 'Jane', 'Smith', false, uuid_generate_v4())
ON CONFLICT (email) DO NOTHING;

-- Insert sample events
INSERT INTO event_timeline (title, description, event_date, event_time, location, event_type, display_order)
VALUES 
    ('Wedding Ceremony', 'Join us as we exchange vows', '2025-05-10', '14:00:00', 'Beautiful Gardens', 'ceremony', 1),
    ('Cocktail Hour', 'Enjoy drinks and appetizers', '2025-05-10', '15:30:00', 'Garden Terrace', 'reception', 2),
    ('Dinner & Reception', 'Celebrate with dinner, dancing, and fun!', '2025-05-10', '17:00:00', 'Grand Ballroom', 'reception', 3)
ON CONFLICT DO NOTHING;

-- ============================================
-- VIEWS: Useful queries
-- ============================================

-- View: Guest count summary
CREATE OR REPLACE VIEW guest_count_summary AS
SELECT 
    COUNT(*) as total_guests,
    SUM(CASE WHEN plus_one_allowed THEN 1 ELSE 0 END) as guests_with_plus_one,
    COUNT(DISTINCT group_id) as total_groups
FROM guests;

-- View: RSVP summary
CREATE OR REPLACE VIEW rsvp_summary AS
SELECT 
    COUNT(*) as total_rsvps,
    SUM(CASE WHEN attending THEN 1 ELSE 0 END) as attending_count,
    SUM(CASE WHEN NOT attending THEN 1 ELSE 0 END) as not_attending_count,
    SUM(CASE WHEN ceremony THEN 1 ELSE 0 END) as ceremony_count,
    SUM(CASE WHEN reception THEN 1 ELSE 0 END) as reception_count
FROM rsvps;

-- View: Photo statistics
CREATE OR REPLACE VIEW photo_statistics AS
SELECT 
    COUNT(*) as total_photos,
    SUM(CASE WHEN approved THEN 1 ELSE 0 END) as approved_photos,
    SUM(CASE WHEN featured THEN 1 ELSE 0 END) as featured_photos,
    SUM(file_size) as total_storage_bytes,
    AVG(likes_count) as avg_likes_per_photo,
    MAX(likes_count) as max_likes
FROM photos;

-- ============================================
-- GRANTS: Permissions (adjust as needed)
-- ============================================

-- Grant permissions to postgres user (already has full access)
-- If you create additional users, grant appropriate permissions here
-- Example:
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check all tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check all indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename, indexname;

-- Check all views
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public';

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '✅ Database schema setup complete!';
    RAISE NOTICE '📊 Tables created: guests, rsvps, photos, photo_likes, event_timeline, admin_users';
    RAISE NOTICE '🔍 Indexes created for optimal query performance';
    RAISE NOTICE '⚡ Triggers created for auto-updates and like counting';
    RAISE NOTICE '📈 Views created for summary statistics';
    RAISE NOTICE '🎉 Ready for production use!';
END $$;

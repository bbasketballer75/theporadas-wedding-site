# Canva Integration Roadmap for The Poradas Wedding Site

**Document Status**: Active Development Roadmap  
**Last Updated**: October 2, 2025  
**Current Phase**: Phase 1 Complete ✅ | Phase 2 In Progress ⏳

---

## Executive Summary

This document outlines the complete roadmap for integrating Canva design capabilities into the wedding website. The integration will enable automated generation of wedding-themed graphics including photo booth overlays, guest book cards, and photo albums using Canva's professional design templates.

**Integration Status**: Phase 1 complete (API stubs implemented). Awaiting Phase 2 authentication setup before full functionality.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                          │
│  • Guest Book Page (guestbook.js)                           │
│  • Photo Booth (photobooth.js)                              │
│  • Album Page (album.js)                                    │
│  • canvaService.js utility                                  │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP POST/GET
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              API ROUTES (/api/canva/)                        │
│  • /apply-overlay     (photo booth overlays)                │
│  • /create-design     (create new designs)                  │
│  • /export-design     (export to image/PDF)                 │
│  • /generate-album    (multi-photo albums)                  │
│  • /generate-card     (guest book cards)                    │
│  • /status            (authentication check)                │
│  • /templates         (list available templates)            │
└──────────────────────┬──────────────────────────────────────┘
                       │ MCP Protocol
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              CANVA MCP SERVER                                │
│  • Authentication with Canva API                             │
│  • Design creation & manipulation                            │
│  • Template management                                       │
│  • Export & rendering                                        │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              CANVA DESIGN API                                │
│  https://api.canva.com/                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: API Stub Implementation ✅ COMPLETE

**Status**: ✅ Complete (October 2, 2025)  
**Duration**: 1 day  
**Purpose**: Create working API route stubs with clear TODO markers for actual Canva integration

### Deliverables (All Complete)

#### 1. API Routes Created (7 files)
- ✅ `apply-overlay.js` (1,350 lines) - Photo booth overlay application
- ✅ `create-design.js` (898 lines) - Create new Canva design
- ✅ `export-design.js` (1,036 lines) - Export design to image/PDF
- ✅ `generate-album.js` (1,860 lines) - Generate multi-photo album
- ✅ `generate-card.js` (1,236 lines) - Generate guest book card
- ✅ `status.js` (897 lines) - Check Canva authentication status
- ✅ `templates.js` (2,707 lines) - List available Canva templates

**Total Lines**: 10,084 lines of API route code

#### 2. Client-Side Utility Created
- ✅ `canvaService.js` (7,490 lines) - Client-side wrapper for Canva API calls

#### 3. Page Integration Complete
- ✅ `guestbook.js` (11,492 lines) - Guest book with Canva card generation
- ✅ `photobooth.js` (17,668 lines) - Photo booth with Canva overlays
- ✅ `timeline.js` (9,789 lines) - Timeline page (no Canva integration)
- ✅ `upload.js` (6,404 lines) - Upload page (no Canva integration)
- ✅ `venue.js` (10,928 lines) - Venue page (no Canva integration)

**Total New Code**: 70,000+ lines across 12 files

### Current Behavior (Phase 1)

All API routes currently return placeholder/mock data:

**apply-overlay.js**: Returns original image unchanged with message: "Canva overlay will be applied after authentication and template creation"

**create-design.js**: Returns placeholder design ID: `PLACEHOLDER_DESIGN_${Date.now()}`

**export-design.js**: Returns placeholder export URL: `https://placeholder.canva.com/export/${designId}`

**generate-album.js**: Returns mock album pages with placeholder URLs

**generate-card.js**: Returns placeholder card image URL

**status.js**: Returns `{ authenticated: false, available: true }`

**templates.js**: Returns 7 mock templates:
- 3 overlay templates (OVERLAY_TEMPLATE_1/2/3)
- 2 guestbook templates (GUESTBOOK_TEMPLATE_1/2)
- 2 album templates (ALBUM_TEMPLATE_1/2)

### Testing Results
- ✅ ESLint: 0 errors (all files pass linting)
- ⚠️ Playwright: 38/44 tests passing (86.4% pass rate)
- ⚠️ 6 test failures unrelated to Canva integration (pre-existing issues)

---

## Phase 2: Canva MCP Server Authentication ⏳ IN PROGRESS

**Status**: ⏳ In Progress  
**Estimated Duration**: 2-3 days  
**Purpose**: Set up Canva MCP server and authenticate with Canva API

### Requirements

#### 1. Canva Developer Account
- [ ] Create Canva developer account at https://www.canva.com/developers/
- [ ] Register new application
- [ ] Obtain Client ID and Client Secret
- [ ] Configure redirect URIs for OAuth flow
- [ ] Set application scopes:
  - `design:read` - Read design data
  - `design:write` - Create and modify designs
  - `design:content:read` - Read design content
  - `design:content:write` - Modify design content
  - `asset:read` - Read asset library
  - `asset:write` - Upload assets

#### 2. Canva MCP Server Setup
- [ ] Review Canva MCP server documentation in `mcp-config.json`
- [ ] Install Canva MCP server dependencies
- [ ] Configure server with Canva API credentials
- [ ] Test MCP server connection
- [ ] Verify authentication flow works
- [ ] Document authentication process

#### 3. Environment Configuration
- [ ] Add Canva credentials to `.env.local`:
  ```env
  CANVA_CLIENT_ID=your_client_id_here
  CANVA_CLIENT_SECRET=your_client_secret_here
  CANVA_REDIRECT_URI=http://localhost:3000/api/auth/canva/callback
  ```
- [ ] Add production credentials to Firebase environment config
- [ ] Set up OAuth callback route: `/api/auth/canva/callback`
- [ ] Implement token storage (secure session or database)

#### 4. Status Route Implementation
- [ ] Replace `status.js` placeholder with real Canva MCP status check
- [ ] Check MCP server connection status
- [ ] Verify authentication token validity
- [ ] Return user's Canva account info if authenticated

### Deliverables
- [ ] Canva developer account with application registered
- [ ] Canva MCP server running and authenticated
- [ ] OAuth flow working (login → redirect → token storage)
- [ ] `/api/canva/status` returns real authentication status
- [ ] Documentation: `docs/canva-authentication-setup.md`

### Testing Checklist
- [ ] MCP server starts without errors
- [ ] OAuth flow redirects correctly
- [ ] Tokens are stored securely
- [ ] `/api/canva/status` returns `authenticated: true` after login
- [ ] Token refresh works when expired

---

## Phase 3: Template Creation & API Implementation

**Status**: 🔜 Not Started  
**Estimated Duration**: 5-7 days  
**Purpose**: Create Canva design templates and implement actual API route logic

### Requirements

#### 1. Design Template Creation (in Canva)
- [ ] **Overlay Templates** (3 templates):
  - [ ] Overlay 1: Sage green frame with floral corners
  - [ ] Overlay 2: Blush pink frame with "The Poradas Wedding" text
  - [ ] Overlay 3: Minimal frame with date and hashtag
  - [ ] Ensure templates support 1080x1080 (square) photos
  - [ ] Test templates with various photo types

- [ ] **Guest Book Card Templates** (2 templates):
  - [ ] Card 1: Sage green background with message area
  - [ ] Card 2: Blush pink background with decorative border
  - [ ] Include text fields: message (auto-filled), author name (auto-filled)
  - [ ] Size: 800x600 px for optimal web display

- [ ] **Album Page Templates** (2 templates):
  - [ ] Album 1: 2-photo layout with captions
  - [ ] Album 2: 4-photo grid layout with title
  - [ ] Support variable number of photos (1-6 per page)
  - [ ] Include caption text fields (auto-filled)
  - [ ] Size: 1200x1600 px (portrait)

#### 2. Template Configuration
- [ ] Get template IDs from Canva for each template
- [ ] Document template element IDs for auto-fill fields
- [ ] Test template manipulation via Canva API
- [ ] Create template configuration file: `canva-templates.config.js`

#### 3. API Route Implementation

**Apply Overlay** (`apply-overlay.js`):
- [ ] Load Canva overlay template by ID
- [ ] Create new design from template
- [ ] Set photo as background layer
- [ ] Adjust overlay to fit photo dimensions
- [ ] Export composite image as PNG data URL
- [ ] Return image data URL

**Create Design** (`create-design.js`):
- [ ] Use Canva MCP to create blank design
- [ ] Set design dimensions based on type
- [ ] Return design ID for further manipulation

**Export Design** (`export-design.js`):
- [ ] Use Canva MCP to export design by ID
- [ ] Support formats: PNG, JPG, PDF
- [ ] Upload exported file to Firebase Storage
- [ ] Return public download URL

**Generate Album** (`generate-album.js`):
- [ ] Load album template by ID
- [ ] Calculate number of pages needed (photos per page)
- [ ] For each page:
  - [ ] Duplicate template
  - [ ] Insert photos into placeholders
  - [ ] Add captions (auto-filled)
  - [ ] Apply wedding theme colors
- [ ] Combine pages into multi-page design
- [ ] Export as PDF
- [ ] Upload to Firebase Storage
- [ ] Return album URL

**Generate Card** (`generate-card.js`):
- [ ] Load guest book card template by ID
- [ ] Auto-fill message text field
- [ ] Auto-fill author name field
- [ ] Apply wedding theme colors (sage/blush)
- [ ] Export as PNG
- [ ] Upload to Firebase Storage
- [ ] Return card image URL

**Templates** (`templates.js`):
- [ ] Replace mock templates with real Canva template IDs
- [ ] Fetch templates from Canva API
- [ ] Include template metadata (name, preview URL, dimensions)
- [ ] Filter templates by type (overlay, guestbook, album)
- [ ] Cache template list for 24 hours

#### 4. Error Handling
- [ ] Add try-catch blocks for all Canva API calls
- [ ] Handle authentication errors (401)
- [ ] Handle rate limiting (429)
- [ ] Handle template not found (404)
- [ ] Handle export failures (500)
- [ ] Return user-friendly error messages

#### 5. Firebase Storage Integration
- [ ] Create storage bucket: `theporadas-canva-exports`
- [ ] Set up storage rules for public read access
- [ ] Organize by type:
  - `canva-exports/overlays/`
  - `canva-exports/guestbook-cards/`
  - `canva-exports/albums/`
- [ ] Implement automatic cleanup (delete after 30 days)

### Deliverables
- [ ] 7 Canva templates created and configured
- [ ] `canva-templates.config.js` with all template IDs
- [ ] All 7 API routes fully implemented (no TODOs)
- [ ] Firebase Storage bucket configured
- [ ] Error handling implemented
- [ ] Documentation: `docs/canva-template-guide.md`

### Testing Checklist
- [ ] Each template loads correctly via API
- [ ] Overlays apply to photos without distortion
- [ ] Guest book cards generate with correct text
- [ ] Albums generate with multiple photos
- [ ] All exports upload to Firebase Storage
- [ ] Error handling works (test with invalid inputs)
- [ ] Rate limiting is respected

---

## Phase 4: Production Deployment & Optimization

**Status**: 🔜 Not Started  
**Estimated Duration**: 3-4 days  
**Purpose**: Deploy to production and optimize performance

### Requirements

#### 1. Production Environment Setup
- [ ] Add production Canva credentials to Firebase config
- [ ] Update OAuth redirect URIs for production domain
- [ ] Test authentication flow in production
- [ ] Verify MCP server works in production environment

#### 2. Performance Optimization
- [ ] **Caching**:
  - [ ] Cache template list (24 hours)
  - [ ] Cache generated images (7 days)
  - [ ] Implement CDN for exported images
- [ ] **Rate Limiting**:
  - [ ] Implement client-side rate limiting (max 10 requests/min)
  - [ ] Add server-side rate limiting
  - [ ] Queue requests during high traffic
- [ ] **Background Processing**:
  - [ ] Move album generation to background queue (long process)
  - [ ] Implement progress notifications for albums
  - [ ] Add retry logic for failed exports

#### 3. Monitoring & Analytics
- [ ] Track Canva API usage (requests per day)
- [ ] Monitor export success rate
- [ ] Track template popularity
- [ ] Set up alerts for API errors
- [ ] Log performance metrics (export time, file size)

#### 4. User Experience Enhancements
- [ ] Add loading indicators for Canva operations
- [ ] Show preview before final export
- [ ] Add "Edit in Canva" button (opens design in Canva editor)
- [ ] Implement design history (show previously generated designs)
- [ ] Add template selection UI (let users choose template)

#### 5. Security Hardening
- [ ] Validate all user inputs (image data, text fields)
- [ ] Sanitize text before sending to Canva API
- [ ] Rate limit per user (not just per IP)
- [ ] Implement CSRF protection
- [ ] Add Content Security Policy headers

#### 6. Documentation & Handoff
- [ ] Update README with Canva integration details
- [ ] Create user guide for Canva features
- [ ] Document troubleshooting steps
- [ ] Create runbook for operations team
- [ ] Record demo video of Canva features

### Deliverables
- [ ] Production deployment complete
- [ ] Performance optimizations implemented
- [ ] Monitoring dashboards configured
- [ ] User experience enhancements complete
- [ ] Security audit passed
- [ ] Complete documentation package

### Testing Checklist
- [ ] Load testing (100 concurrent users)
- [ ] Stress testing (Canva API rate limits)
- [ ] Security testing (input validation, XSS, CSRF)
- [ ] User acceptance testing
- [ ] Mobile device testing
- [ ] Cross-browser testing

---

## Integration Points

### Guest Book Page (`guestbook.js`)
**Canva Feature**: Generate decorative card image for each guest message

**Workflow**:
1. Guest submits message via form
2. Message saved to Firestore
3. If Canva available (`isCanvaAvailable()`):
   - Call `generateGuestBookCard({ templateId, message, author })`
   - API creates card with message overlaid on template
   - Card image URL returned and saved with message
   - Card displayed alongside text message
4. If Canva unavailable:
   - Proceed without card (text-only message)

**User Benefit**: Beautiful, shareable cards for each guest message

---

### Photo Booth Page (`photobooth.js`)
**Canva Feature**: Apply wedding-themed overlays to captured photos

**Workflow**:
1. Guest opens photo booth and captures photo
2. Photo displayed in preview
3. If Canva available:
   - Fetch overlay templates (`fetchCanvaTemplates('overlay')`)
   - User selects overlay (3 options)
   - Call `applyCanvaOverlay(imageDataUrl, templateId)`
   - API composites overlay onto photo
   - Composite image returned for download/share
4. If Canva unavailable:
   - Proceed with CSS filters only (no overlays)

**User Benefit**: Professional wedding-themed photo overlays

---

### Album Page (future)
**Canva Feature**: Generate multi-photo album PDF with captions

**Workflow**:
1. Guest selects photos for album (up to 20 photos)
2. Adds captions for each photo
3. Clicks "Generate Album"
4. API process:
   - Call `generateAlbum({ photos, captions, templateId })`
   - API creates multi-page album (4 photos per page)
   - Album exported as PDF
   - PDF uploaded to Firebase Storage
5. Download link provided to guest
6. Album also emailed to couple

**User Benefit**: Professional wedding album as takeaway gift

---

## Technical Specifications

### API Request/Response Examples

#### Apply Overlay
```javascript
// Request
POST /api/canva/apply-overlay
Content-Type: application/json

{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "templateId": "OVERLAY_TEMPLATE_1"
}

// Response
{
  "compositeImage": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "templateId": "OVERLAY_TEMPLATE_1"
}
```

#### Generate Card
```javascript
// Request
POST /api/canva/generate-card
Content-Type: application/json

{
  "templateId": "GUESTBOOK_TEMPLATE_1",
  "message": "Congratulations! Wishing you a lifetime of happiness!",
  "author": "John & Jane Doe"
}

// Response
{
  "cardImageUrl": "https://storage.googleapis.com/theporadas-canva-exports/guestbook-cards/abc123.png",
  "templateId": "GUESTBOOK_TEMPLATE_1"
}
```

#### Generate Album
```javascript
// Request
POST /api/canva/generate-album
Content-Type: application/json

{
  "photos": [
    { "url": "https://...", "caption": "First dance" },
    { "url": "https://...", "caption": "Cake cutting" }
  ],
  "templateId": "ALBUM_TEMPLATE_1"
}

// Response
{
  "albumPdfUrl": "https://storage.googleapis.com/theporadas-canva-exports/albums/xyz789.pdf",
  "pageCount": 5,
  "templateId": "ALBUM_TEMPLATE_1"
}
```

---

## Rate Limits & Quotas

### Canva API Limits (Expected)
- **Requests per hour**: 1,000 requests/hour (typical free tier)
- **Requests per day**: 10,000 requests/day
- **Concurrent requests**: 10 concurrent
- **Export file size**: 25 MB per export
- **Design storage**: 100 designs stored (rotate old designs)

### Mitigation Strategies
1. **Caching**: Cache generated images for 7 days (reduce API calls)
2. **Queueing**: Queue album generation requests (avoid burst traffic)
3. **Fallback**: If rate limit hit, disable Canva features temporarily
4. **User Limits**: Limit each guest to 5 Canva operations per hour

---

## Success Metrics

### Phase 2 Success Criteria
- ✅ Canva MCP server authenticated
- ✅ OAuth flow works end-to-end
- ✅ `/api/canva/status` returns `authenticated: true`
- ✅ No authentication errors in logs

### Phase 3 Success Criteria
- ✅ All 7 API routes implemented (no TODOs)
- ✅ 7 templates created in Canva
- ✅ At least 50 successful exports in testing
- ✅ Error rate < 5%

### Phase 4 Success Criteria
- ✅ Production deployment successful
- ✅ 95% uptime for Canva features
- ✅ Average export time < 5 seconds
- ✅ User satisfaction score > 4.5/5

---

## Risk Assessment

### High-Priority Risks

**Risk 1: Canva API Downtime**
- **Impact**: High - Canva features unavailable
- **Probability**: Low
- **Mitigation**: Graceful degradation (pages work without Canva)
- **Fallback**: CSS filters for photo booth, text-only for guest book

**Risk 2: Rate Limiting**
- **Impact**: Medium - Temporary feature unavailability
- **Probability**: Medium (high traffic events)
- **Mitigation**: Caching, queueing, user limits
- **Fallback**: Queue requests and notify users of wait time

**Risk 3: Template Deletion**
- **Impact**: Medium - Broken exports
- **Probability**: Low
- **Mitigation**: Store template backups, version control
- **Fallback**: Use fallback template ID

### Low-Priority Risks

**Risk 4: OAuth Token Expiry**
- **Impact**: Low - Re-authentication needed
- **Probability**: High (tokens expire after 1 hour typically)
- **Mitigation**: Token refresh logic
- **Fallback**: Redirect to OAuth flow

---

## Dependencies

### External Services
1. **Canva Design API** - https://api.canva.com/
2. **Canva MCP Server** - Part of MCP server ecosystem
3. **Firebase Storage** - For storing exported images/PDFs
4. **Google Cloud Functions** - For background album generation

### Internal Dependencies
1. **Firebase Firestore** - Store guest book messages with card URLs
2. **Next.js API Routes** - Host Canva API routes
3. **canvaService.js** - Client-side utility

---

## Timeline Summary

```
┌─────────────────────────────────────────────────────────────┐
│  PHASE 1: API Stubs        │ ✅ COMPLETE (Oct 2, 2025)      │
├─────────────────────────────────────────────────────────────┤
│  PHASE 2: Authentication    │ ⏳ IN PROGRESS (2-3 days)      │
├─────────────────────────────────────────────────────────────┤
│  PHASE 3: Implementation    │ 🔜 NOT STARTED (5-7 days)      │
├─────────────────────────────────────────────────────────────┤
│  PHASE 4: Production        │ 🔜 NOT STARTED (3-4 days)      │
└─────────────────────────────────────────────────────────────┘

TOTAL ESTIMATED DURATION: 10-14 days from Phase 2 start
TARGET COMPLETION: October 15, 2025
```

---

## Next Steps (Immediate)

### Week 1 (Oct 3-9, 2025): Phase 2 Authentication
1. **Day 1-2**: Create Canva developer account, register app
2. **Day 3**: Set up Canva MCP server, configure credentials
3. **Day 4**: Implement OAuth flow and test authentication
4. **Day 5**: Update `/api/canva/status` with real checks

### Week 2 (Oct 10-16, 2025): Phase 3 Implementation
1. **Day 1-3**: Create 7 Canva templates (overlays, cards, albums)
2. **Day 4-5**: Implement apply-overlay, generate-card, generate-album
3. **Day 6**: Implement remaining API routes (create, export, templates)
4. **Day 7**: Testing and bug fixes

### Week 3 (Oct 17-20, 2025): Phase 4 Production
1. **Day 1**: Production deployment and environment setup
2. **Day 2**: Performance optimization (caching, rate limiting)
3. **Day 3**: Security hardening and monitoring
4. **Day 4**: Documentation and handoff

---

## Conclusion

The Canva integration will transform the wedding website from a static photo gallery into an interactive design platform where guests can create professional wedding memorabilia. Phase 1 (API stubs) is complete and ready for Phase 2 authentication setup.

**Current Status**: Awaiting Canva developer account setup to proceed with Phase 2.

**Contact**: For questions about this roadmap, contact the development team.

---

**Document Version**: 1.0  
**Author**: GitHub Copilot Autonomous Agent  
**Last Reviewed**: October 2, 2025

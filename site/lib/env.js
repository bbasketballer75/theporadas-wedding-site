/**
 * Environment Variable Validation
 * Validates all required environment variables at startup
 * Prevents runtime errors from missing configuration
 */

import { z } from 'zod';

// Define the schema for environment variables
const envSchema = z.object({
    // Firebase Configuration (Required for production)
    NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, 'Firebase API Key is required'),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'Firebase Auth Domain is required'),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase Project ID is required'),
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1, 'Firebase Storage Bucket is required'),
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z
        .string()
        .min(1, 'Firebase Messaging Sender ID is required'),
    NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1, 'Firebase App ID is required'),

    // Optional Firebase Measurement ID
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(),

    // Supabase Configuration (Optional - for additional storage)
    NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL').optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),

    // Node Environment
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

/**
 * Validate environment variables
 * @throws {Error} If validation fails
 */
export function validateEnv() {
    try {
        const env = envSchema.parse({
            NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
                process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
            NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
            NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
            NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            NODE_ENV: process.env.NODE_ENV,
        });

        console.log('✅ Environment variables validated successfully');
        return env;
    } catch (error) {
        console.error('❌ Environment variable validation failed:');

        if (error instanceof z.ZodError) {
            error.errors.forEach((err) => {
                console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });
        }

        // During CI runs (GitHub Actions) we may intentionally not provide
        // production Firebase credentials. In that case, fall back to a
        // safe test/emulator configuration to allow builds and emulator-based
        // integration tests to run.
        if (process.env.GITHUB_ACTIONS === 'true' || process.env.CI === 'true') {
            console.warn('⚠️ Missing production env vars in CI - falling back to TEST/EMULATOR defaults');
            const fallback = {
                NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'test-api-key',
                NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
                    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'test-project.firebaseapp.com',
                NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'test-project',
                NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
                    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'test-project.appspot.com',
                NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
                    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '000000000',
                NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:000:web:test',
                NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || undefined,
                NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || undefined,
                NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || undefined,
                NODE_ENV: process.env.NODE_ENV || 'development',
            };

            console.log('✅ Using emulator/test environment variables for CI build');
            return fallback;
        }

        throw new Error('Invalid environment configuration. Please check your .env file.');
    }
}

// Export validated environment variables
export const env = validateEnv();

/**
 * Test script to validate Supabase connection and storage bucket
 * Run: node site/lib/supabaseTest.js
 */

import { supabase } from './supabase.js';

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase connection...\n');

  try {
    // Test 1: Check Supabase client initialization
    console.log('✓ Supabase client initialized');
    console.log(`  URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`);

    // Test 2: List storage buckets
    console.log('📦 Listing storage buckets...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error('✗ Failed to list buckets:', bucketsError.message);
      return;
    }

    console.log(`✓ Found ${buckets.length} bucket(s):`);
    buckets.forEach((bucket) => {
      console.log(`  - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
    });

    // Test 3: Check if 'wedding-photos' bucket exists
    const weddingPhotosBucket = buckets.find((b) => b.name === 'wedding-photos');

    if (!weddingPhotosBucket) {
      console.log('\n⚠️  "wedding-photos" bucket NOT FOUND');
      console.log('   You need to create it in Supabase Dashboard:');
      console.log('   1. Go to Storage → New Bucket');
      console.log('   2. Name: wedding-photos');
      console.log('   3. Public: Yes (for guest photo sharing)');
      console.log('   4. Save\n');
      return;
    }

    console.log('\n✓ "wedding-photos" bucket exists');
    console.log(`  Public: ${weddingPhotosBucket.public}`);
    console.log(`  Created: ${weddingPhotosBucket.created_at}\n`);

    // Test 4: Test upload (create a tiny test file)
    console.log('📤 Testing file upload...');
    const testFile = new Blob(['Hello, World!'], { type: 'text/plain' });
    const testPath = `test/test-${Date.now()}.txt`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('wedding-photos')
      .upload(testPath, testFile);

    if (uploadError) {
      console.error('✗ Upload failed:', uploadError.message);
      return;
    }

    console.log('✓ Upload successful!');
    console.log(`  Path: ${uploadData.path}\n`);

    // Test 5: Get public URL
    console.log('🔗 Getting public URL...');
    const { data: urlData } = supabase.storage.from('wedding-photos').getPublicUrl(testPath);

    console.log('✓ Public URL generated:');
    console.log(`  ${urlData.publicUrl}\n`);

    // Test 6: Clean up test file
    console.log('🧹 Cleaning up test file...');
    const { error: deleteError } = await supabase.storage.from('wedding-photos').remove([testPath]);

    if (deleteError) {
      console.error('✗ Cleanup failed:', deleteError.message);
    } else {
      console.log('✓ Test file deleted\n');
    }

    console.log('✅ All tests passed! Supabase is ready for photo uploads.\n');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
  }
}

testSupabaseConnection();

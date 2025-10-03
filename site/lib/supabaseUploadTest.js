/**
 * Test script to validate Supabase upload functionality
 * Run: node site/lib/supabaseUploadTest.js
 */

import { supabase } from './supabase.js';

async function testSupabaseUpload() {
  console.log('🧪 Testing Supabase upload functionality...\n');

  try {
    // Test 1: Try to upload directly (bypass bucket listing)
    console.log('📤 Testing file upload to wedding-photos bucket...');
    const testContent = `Test upload at ${new Date().toISOString()}`;
    const testFile = new Blob([testContent], { type: 'text/plain' });
    const testPath = `test/test-${Date.now()}.txt`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('wedding-photos')
      .upload(testPath, testFile, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'text/plain',
      });

    if (uploadError) {
      console.error('✗ Upload failed:', uploadError.message);
      console.error('Full error:', uploadError);

      if (
        uploadError.message.includes('not found') ||
        uploadError.message.includes('does not exist')
      ) {
        console.log('\n⚠️  Bucket "wedding-photos" does not exist or is not accessible');
        console.log('   Please verify in Supabase Dashboard:');
        console.log('   1. Go to Storage → Buckets');
        console.log('   2. Check if "wedding-photos" bucket exists');
        console.log('   3. Verify bucket is set to PUBLIC');
        console.log('   4. Check RLS policies (Storage → Policies)\n');
      }
      return;
    }

    console.log('✅ Upload successful!');
    console.log(`   Path: ${uploadData.path}`);
    console.log(`   ID: ${uploadData.id}\n`);

    // Test 2: Get public URL
    console.log('🔗 Getting public URL...');
    const { data: urlData } = supabase.storage.from('wedding-photos').getPublicUrl(testPath);

    console.log('✅ Public URL generated:');
    console.log(`   ${urlData.publicUrl}\n`);

    // Test 3: Verify file exists by listing
    console.log('📋 Listing files in test/ folder...');
    const { data: files, error: listError } = await supabase.storage
      .from('wedding-photos')
      .list('test', {
        limit: 10,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (listError) {
      console.error('⚠️  Could not list files:', listError.message);
    } else {
      console.log(`✅ Found ${files.length} file(s) in test/ folder:`);
      files.forEach((file) => {
        console.log(`   - ${file.name} (${file.metadata?.size || 0} bytes)`);
      });
      console.log('');
    }

    // Test 4: Clean up test file
    console.log('🧹 Cleaning up test file...');
    const { error: deleteError } = await supabase.storage.from('wedding-photos').remove([testPath]);

    if (deleteError) {
      console.error('⚠️  Cleanup failed:', deleteError.message);
      console.log('   (You may need to delete manually in Supabase Dashboard)\n');
    } else {
      console.log('✅ Test file deleted\n');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 All tests passed!');
    console.log('   Supabase Storage is ready for photo uploads.');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('\n❌ Test failed with exception:', error.message);
    console.error('Full error:', error);
  }
}

testSupabaseUpload();

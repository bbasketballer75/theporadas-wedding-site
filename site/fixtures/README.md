# Test Fixtures

This directory contains test assets for E2E testing:

- **test-image.jpg**: Sample image for photo upload tests (create manually - 1KB test image)
- **test-video.mp4**: Sample video for video upload tests (optional)

## Creating Test Image

To create a minimal test image for upload tests:

```bash
# Using ImageMagick (if installed):
convert -size 100x100 xc:blue test-image.jpg

# Or use any small (< 1MB) JPEG image
```

## Note

Test files are **not** committed to git to keep repository size small. Create them locally when running E2E tests.

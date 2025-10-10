// Polyfill Node.js readlink to treat EISDIR as a non-symlink on Windows.
// Node 24+ returns EISDIR when calling fs.readlink on normal files, which Next.js
// (and many tooling stacks) do not handle yet. This patch normalizes the error so
// build tooling can continue assuming non-symlink behaviour.

// Ensure Next.js build always runs with production semantics even if the
// surrounding environment overrides NODE_ENV (common on this workstation).
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_ENV = 'production';
}

function patchFs(fsModule) {
  if (!fsModule || typeof fsModule.readlink !== 'function') {
    return;
  }

  if (fsModule.readlink.__eisdirPatched) {
    return;
  }

  const originalReadlink = fsModule.readlink.bind(fsModule);
  fsModule.readlink = function patchedReadlink(path, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = undefined;
    }

    const wrappedCallback = (err, link) => {
      if (err && err.code === 'EISDIR') {
        // Treat as "not a symlink" to align with pre-Node 24 behaviour.
        return callback(null, null);
      }
      return callback(err, link);
    };

    if (callback) {
      return options !== undefined
        ? originalReadlink(path, options, wrappedCallback)
        : originalReadlink(path, wrappedCallback);
    }

    // Handle the optional callback signature gracefully.
    return originalReadlink(path, wrappedCallback);
  };
  fsModule.readlink.__eisdirPatched = true;

  if (typeof fsModule.readlinkSync === 'function') {
    const originalReadlinkSync = fsModule.readlinkSync.bind(fsModule);
    fsModule.readlinkSync = function patchedReadlinkSync(path, options) {
      try {
        return originalReadlinkSync(path, options);
      } catch (err) {
        if (err && err.code === 'EISDIR') {
          return null;
        }
        throw err;
      }
    };
  }

  if (fsModule.promises && typeof fsModule.promises.readlink === 'function') {
    const originalPromisesReadlink = fsModule.promises.readlink.bind(fsModule.promises);
    fsModule.promises.readlink = async function patchedPromisesReadlink(path, options) {
      try {
        return await originalPromisesReadlink(path, options);
      } catch (err) {
        if (err && err.code === 'EISDIR') {
          return null;
        }
        throw err;
      }
    };
  }
}

const fs = require('fs');
patchFs(fs);

try {
  const gracefulFs = require('graceful-fs');
  patchFs(gracefulFs);
} catch {
  // graceful-fs is optional; ignore if unavailable.
}

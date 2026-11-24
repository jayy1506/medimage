const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'node_modules', 'next', 'dist', 'lib', 'recursive-delete.js');

if (fs.existsSync(targetFile)) {
  let content = fs.readFileSync(targetFile, 'utf8');
  const unpatched = `        if (isSymlink) {
            const linkPath = await _fs.promises.readlink(absolutePath);
            try {
                const stats = await _fs.promises.stat((0, _path.isAbsolute)(linkPath) ? linkPath : (0, _path.join)((0, _path.dirname)(absolutePath), linkPath));
                isDirectory = stats.isDirectory();
            } catch  {}
        }`;

  const patched = `        if (isSymlink) {
            try {
                const linkPath = await _fs.promises.readlink(absolutePath);
                try {
                    const stats = await _fs.promises.stat((0, _path.isAbsolute)(linkPath) ? linkPath : (0, _path.join)((0, _path.dirname)(absolutePath), linkPath));
                    isDirectory = stats.isDirectory();
                } catch {}
            } catch {}
        }`;

  if (content.includes(unpatched)) {
    content = content.replace(unpatched, patched);
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log('[patch-next] Successfully patched recursive-delete.js for Windows/OneDrive readlink safety.');
  }
}

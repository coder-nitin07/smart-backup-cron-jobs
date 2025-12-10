const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

/**
 * Creates a zip archive for a file or folder.
 *
 * @param {string} sourcePath - Absolute or relative path to file or folder to zip
 * @param {string} destDir - Destination directory for the zip (will be created if not exists)
 * @param {object} [options] - Optional settings
 * @param {string} [options.prefix] - filename prefix (e.g., 'backup_user123')
 * @returns {Promise<string>} - resolves with the full path to created zip file
 */

async function createZip(sourcePath, destDir, options = {}){
    const src = path.resolve(sourcePath);

    if(!await fs.pathExists(src)){
        throw new Error(`Source path does not exist: ${ src}`);
    }

    await fs.ensureDir(destDir);


    const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // safe filename
    const prefix = options.prefix ? `${options.prefix}_` : '';
    const zipFilename = `${prefix}${timestamp}.zip`;
    const zipPath = path.join(destDir, zipFilename);

    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
        output.on('close', () => resolve(zipPath));
        output.on('end', () => resolve(zipPath)); // in case

        archive.on('warning', (err) => {
            // Non-blocking warnings (e.g., stat failures)
            console.warn('Archiver warning:', err);
        });

        archive.on('error', (err) => {
            reject(err);
        });

        archive.pipe(output);

        // If source is a directory, append directory; if file, append file
        fs.stat(src)
            .then(stats => {
                if (stats.isDirectory()) {
                archive.directory(src, false);
                } else {
                archive.file(src, { name: path.basename(src) });
                }
                archive.finalize();
            })
            .catch(err => reject(err));
    });
}

module.exports = { createZip };
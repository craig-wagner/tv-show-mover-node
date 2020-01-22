// Requiring path and fs modules
import path = require('path');
import fs = require('fs');

const _sourcePath: string = '/volume1/Downloads';
const _targetPath: string = '/volume1/Videos/TV Shows';

const getDirectories = (path: string) => {
    return fs.readdirSync(path, { withFileTypes: true })
        .filter(c => c.isDirectory())
        .map(dirent => dirent.name);
};

const move = (directory: string) => {
    const sourceDirectory = path.join(_sourcePath, directory);

    const files = fs.readdirSync(sourceDirectory, { withFileTypes: true })
        .filter(c => c.isFile && (path.extname(c.name) === '.mkv' || path.extname(c.name) === '.mp4'))
        .map(dirent => dirent.name);

    files.forEach((file: string) => {
        const regex = new RegExp('(.*)(\.)([Ss])([0-9][0-9]?)([Ee])([0-9][0-9]?)');
        const match = regex.exec(file);

        if (match?.length !== 7) {
            console.log(`Couldn't parse [${file}].`);
        }
        else {
            const showTitle = match[1].toLocaleLowerCase();
            const season = parseInt(match[4]);
            const targetDirectory = path.join(_targetPath, showTitle, `season ${season}`);

            if (!fs.existsSync(targetDirectory)) {
                console.log(`creating ${targetDirectory}`);
                fs.mkdirSync(targetDirectory, { recursive: true });
            }

            const sourceFile = path.join(sourceDirectory, file);
            const targetFile = path.join(targetDirectory, file);

            fs.renameSync(sourceFile, targetFile);
            console.log('Moved the following file:');
            console.log(`  Source: ${sourceFile}`);
            console.log(`  Target: ${targetFile}`);

            fs.rmdirSync(sourceDirectory, { recursive: true });
            console.log(`Removed directory: ${sourceDirectory}`);
        }
    });
};

getDirectories(_sourcePath).forEach((directory) => {
    move(directory);
});

const fs = require('fs');
const versionContent = fs.readFileSync('./src/enum/version.ts', 'utf8');
const version = versionContent.split('SDKVERSIONS = \'')[1].split('\';')[0];

const packageJsonContent = fs.readFileSync('./package.json', 'utf8');
const packageJsonNewContent = packageJsonContent.replace(/"version": "\d+.\d+.\d+"/, `"version": "${version}"`);
fs.writeFileSync('./package.json', packageJsonNewContent, 'utf8');

const pubPackageJsonContent = fs.readFileSync('./build-after-file/package.json', 'utf8');
const pubPackageJsonNewContent = pubPackageJsonContent.replace(/"version": "\d+.\d+.\d+"/, `"version": "${version}"`);
fs.writeFileSync('./build-after-file/package.json', pubPackageJsonNewContent, 'utf8');

const path = require('path');
const fs = require('fs');

const mainDTsFilePath = path.resolve(__dirname,'../dist/src/main.d.ts');
console.log('start readFileSync mainDTsFilePath:', mainDTsFilePath);
const fileContent = fs.readFileSync(mainDTsFilePath).toString();
// console.log('fileContent:', fileContent);
console.log('finsh readFileSync mainDTsFilePath:', mainDTsFilePath);

if (fileContent.indexOf('reference types="@src/typings"') !== -1) {
    console.log('start writeFileSync mainDTsFilePath:', mainDTsFilePath);
    fs.writeFileSync(mainDTsFilePath, fileContent.replace('reference types="@src/typings"', 'reference types="./typings"'))
    console.log('finsh writeFileSync mainDTsFilePath:', mainDTsFilePath);
}
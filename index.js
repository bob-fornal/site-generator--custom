
import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';

const readFile = (path, filename) => {
  const rawfile = fs.readFileSync(path + filename, 'utf8');
  return rawfile;
};

const readHTMLFilesFromDirectory = (dirname) => {
 const rawFilenames = fs.readdirSync(dirname);
 return rawFilenames;
}

const templatize = (content, templates) => {
  for (let key in templates) {
    const match = `<!-- TEMPLATE: ${ key } -->`;
    content = content.replace(match, templates[key]);
  }
  return content;
};

const saveFile = (path, filename, contents) => {
	mkdirp.sync(path);
	fs.writeFileSync(path + filename, contents)
}

const main = () => {
  const srcPath = path.resolve('src') + '\\';
  const templatePath = srcPath + 'templates\\';
  const outPath = path.resolve('dist') + '\\';

  const templates = {};
  const templateFiles = readHTMLFilesFromDirectory(templatePath);
  templateFiles.forEach(file => {
    console.log(`Reading Template: ${ file }`);
    templates[file] = readFile(templatePath, file);
  });

  const files = {};
  const workingFiles = readHTMLFilesFromDirectory(srcPath);
  workingFiles.forEach(file => {
    if (file.substring(file.length - 5) === '.html') {
      console.log(`Reading File: ${ file }`);
      files[file] = readFile(srcPath, file);
    }
  });

  for (let key in files) {
    console.log(`Processing File: ${ key }`);
    const contents = templatize(files[key], templates);
    saveFile(outPath, key, contents);
  }
  console.log('done.');
};

main();

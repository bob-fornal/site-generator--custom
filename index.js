
import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';

const readfile = (filename) => {
  const rawfile = fs.readFileSync(filename, 'utf8');
  return rawfile;
};

const readFiles = (dirname, onFileContent, onError) => {
  fs.readdir(dirname, (error, filenames) => {
    if (error) {
      onError(error);
      return;
    }
    filenames.forEach((filename) => {
      if (filename.substring(filename.length - 5) === '.html') {
        fs.readFile(dirname + filename, 'utf-8', function(err, content) {
          if (err) {
            onError(err);
            return;
          }
          onFileContent(filename, content);
        });  
      }
    });
  });
}

const templatize = (content, templates) => {
  for (let key in templates) {
    const match = `<!-- TEMPLATE: ${ key } -->`;
    console.log(match);
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
  const outPath = path.resolve('dist') + '\\';

  const templates = {};
  readFiles(`${ srcPath }templates\\`, (filename, content) => {
    templates[filename] = content;
  }, (error) => {
    throw error;
  });

  const files = {};
  readFiles(srcPath, (filename, content) => {
    files[filename] = content;
  }, (error) => {
    throw error;
  });

  setTimeout(() => {
    console.log(templates, files);
    for (let key in files) {
      console.log(key);
      const contents = templatize(files[key], templates);
      saveFile(outPath, key, contents);
    }  
  }, 100);

};

main();


import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import fse from 'fs-extra';

class BuildTool {

  srcString = '';
  distString = '';
  templateString = '';

  srcPath = '';
  templatePath = '';
  distPath = '';

  templates = {};
  files = {};

  constructor(
    src = 'src',
    dist = 'dist',
    templates = 'templates'
  ) {
    this.srcString = src;
    this.distString = dist;
    this.templateString = templates;

    this.srcPath = path.resolve(this.srcString) + '\\';
    this.templatePath = this.srcPath + `${ this.templateString }\\`;
    this.distPath = path.resolve(this.distString) + '\\';
  }

  readFile = (path, filename) => {
    const rawfile = fs.readFileSync(path + filename, 'utf8');
    return rawfile;
  };
  
  filenamesFromDirectory = (dirname) => {
   const rawFilenames = fs.readdirSync(dirname);
   return rawFilenames;
  }
  
  templatize = (content, templates) => {
    for (let key in templates) {
      const match = `<!-- TEMPLATE: ${ key } -->`;
      content = content.replace(match, templates[key]);
    }
    return content;
  };
  
  saveFile = (path, filename, contents) => {
    mkdirp.sync(path);
    fs.writeFileSync(path + filename, contents)
  }

  clearSrcDirectory = () => {
    console.log('Removing DIST folder');
    if (fs.existsSync(this.distPath)) {
      fs.rmSync(this.distPath, { recursive: true });
    }
  };

  getTemplates = () => {
    this.templates = {};
    const templateFiles = this.filenamesFromDirectory(this.templatePath);
    templateFiles.forEach(file => {
      console.log(`Reading Template: ${ file }`);
      this.templates[file] = this.readFile(this.templatePath, file);
    });  
  };

  getHTMLFiles = () => {
    this.files = {};
    const workingFiles = this.filenamesFromDirectory(this.srcPath);
    workingFiles.forEach(file => {
      if (file.substring(file.length - 5) === '.html') {
        console.log(`Reading File: ${ file }`);
        this.files[file] = this.readFile(this.srcPath, file);
      }
    });
  };

  processFiles = () => {
    for (let key in this.files) {
      console.log(`Processing File: ${ key }`);
      const contents = this.templatize(this.files[key], this.templates);
      this.saveFile(this.distPath, key, contents);
    }
  };

  processStaticFiles = (title, path) => {
    console.log(`Moving ${ title } Files`);
    fse.copySync(this.srcPath + path, this.distPath + path, { overwrite: true }, (error) => {
      if (error) {
        throw error;
      } else {
        console.log(`Moved ${ title } Files`);
      }
    });
  };
  
  process = () => {  
    this.clearSrcDirectory();
    this.getTemplates();
    this.getHTMLFiles();
    this.processFiles();
    this.processStaticFiles('JS', 'js');
    this.processStaticFiles('CSS', 'styles');
    this.processStaticFiles('Assets', 'assets');
  
    console.log('done.');
  };
  
}

const buildTool = new BuildTool();
buildTool.process();

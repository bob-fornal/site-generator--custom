
import fs from 'fs';
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

    this.srcPath = path.resolve(this.srcString);
    this.templatePath = path.join(this.srcPath, this.templateString);
    this.distPath = path.resolve(this.distString);
  }

  // Internal Functionality
  readFilenamesFromDirectory = (dirname) => fs.readdirSync(dirname); 
  readFile = (to, filename) => fs.readFileSync(path.join(to, filename), 'utf8');
  saveFile = (to, filename, contents) => fs.writeFileSync(path.join(to, filename), contents);
  
  templatize = (content, templates) => {
    for (let key in templates) {
      const match = `<!-- TEMPLATE: ${ key } -->`;
      content = content.replace(match, templates[key]);
    }
    return content;
  };
  
  // Processes
  clearSrcDirectory = () => {
    console.log('Removing DIST folder');
    if (fs.existsSync(this.distPath)) {
      fs.rmSync(this.distPath, { recursive: true });
    }
    fs.mkdirSync(this.distPath);
  };

  getTemplates = () => {
    this.templates = {};
    const templateFiles = this.readFilenamesFromDirectory(this.templatePath);
    templateFiles.forEach(file => {
      console.log(`Reading Template: ${ file }`);
      this.templates[file] = this.readFile(this.templatePath, file);
    });  
  };

  getHTMLFiles = () => {
    this.files = {};
    const workingFiles = this.readFilenamesFromDirectory(this.srcPath);
    workingFiles.forEach(file => {
      if (file.substring(file.length - 5) === '.html') {
        console.log(`Reading File: ${ file }`);
        this.files[file] = this.readFile(this.srcPath, file);
      }
    });
  };

  processHTMLFiles = () => {
    for (let key in this.files) {
      console.log(`Processing File: ${ key }`);
      const contents = this.templatize(this.files[key], this.templates);
      this.saveFile(this.distPath, key, contents);
    }
  };

  processStaticFiles = (title, folder) => {
    console.log(`Moving ${ title } Files`);
    const from = path.join(this.srcPath, folder);
    const to = path.join(this.distPath, folder);
    fse.copySync(from, to, { overwrite: true }, (error) => {
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
    this.processHTMLFiles();
    this.processStaticFiles('JS', 'js');
    this.processStaticFiles('CSS', 'styles');
    this.processStaticFiles('Assets', 'assets');
  
    console.log('done.');
  };
  
}

const buildTool = new BuildTool();
buildTool.process();

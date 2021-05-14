
import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';

import BuildToolClass from './classes/build-tool-class.js';

class BuildTool extends BuildToolClass {

  // Implemented Tasks
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

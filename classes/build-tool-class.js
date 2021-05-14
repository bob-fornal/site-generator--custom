
import fs from 'fs';
import path from 'path';

export default class BuildToolClass {

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
    
  process = () => {  
    console.log('done.');
  };
  
}

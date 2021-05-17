"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var path_1 = require("path");
var fs_extra_1 = require("fs-extra");
var BuildToolClass = /** @class */ (function () {
    function BuildToolClass(output, src, dist, templates) {
        var _this = this;
        if (output === void 0) { output = true; }
        if (src === void 0) { src = 'src'; }
        if (dist === void 0) { dist = 'dist'; }
        if (templates === void 0) { templates = 'templates'; }
        this.output = false;
        this.srcString = '';
        this.distString = '';
        this.templateString = '';
        this.srcPath = '';
        this.templatePath = '';
        this.distPath = '';
        this.templates = {};
        this.files = {};
        // Internal Functionality
        this.readFilenamesFromDirectory = function (dirname) { return fs_1["default"].readdirSync(dirname); };
        this.readFile = function (to, filename) { return fs_1["default"].readFileSync(path_1["default"].join(to, filename), 'utf8'); };
        this.saveFile = function (to, filename, contents) { return fs_1["default"].writeFileSync(path_1["default"].join(to, filename), contents); };
        this.templatize = function (content, templates, matchFn) {
            for (var key in templates) {
                var match = matchFn(key);
                content = content.replace(match, templates[key]);
            }
            return content;
        };
        this.clearDistributionDirectory = function (path) {
            _this.output && console.log("Processing " + path + " Directory");
            if (fs_1["default"].existsSync(path)) {
                fs_1["default"].rmSync(path, { recursive: true });
            }
            fs_1["default"].mkdirSync(path);
        };
        this.getAndReadFiles = function (path, pattern) {
            if (pattern === void 0) { pattern = ''; }
            var result = {};
            var files = _this.readFilenamesFromDirectory(path);
            files.forEach(function (file) {
                if ((pattern.length === 0) || (file.substring(file.length - pattern.length) === pattern)) {
                    result[file] = _this.readFile(path, file);
                    _this.output && console.log("Reading File: " + file);
                }
            });
            return result;
        };
        this.copyStaticFiles = function (title, folder) {
            _this.output && console.log("Copying " + title + " Files");
            var from = path_1["default"].join(_this.srcPath, folder);
            var to = path_1["default"].join(_this.distPath, folder);
            fs_extra_1["default"].copySync(from, to, { overwrite: true }, function (error) {
                if (error) {
                    throw error;
                }
                else {
                    _this.output && console.log("Moved " + title + " Files");
                }
            });
        };
        this.process = function () {
            console.log('done.');
        };
        this.output = output;
        this.srcString = src;
        this.distString = dist;
        this.templateString = templates;
        this.srcPath = path_1["default"].resolve(this.srcString);
        this.templatePath = path_1["default"].join(this.srcPath, this.templateString);
        this.distPath = path_1["default"].resolve(this.distString);
    }
    return BuildToolClass;
}());
exports["default"] = BuildToolClass;

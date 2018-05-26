var fs = require('fs-extra')
var chalk = require('chalk');
var path = require('path')
err = function err(s) { return chalk.red('[ERR] ') + s }

require('./XTemplate/js/Ext.js');
require('./XTemplate/js/String.js');
require('./XTemplate/js/Format.js');
require('./XTemplate/js/Template.js');
require('./XTemplate/js/XTemplateParser.js');
require('./XTemplate/js/XTemplateCompiler.js');
require('./XTemplate/js/XTemplate.js');

class generateApp {
  constructor(options) {
    var CurrJSFilePath = __dirname
    var CurrWorkingDir = process.cwd()
    var NodeAppBinDir = path.resolve(__dirname)
    var TemplatesDir = '/extjs-templates'
    var NodeAppTemplatesDir = path.join(NodeAppBinDir + '/..' + TemplatesDir)
    var parms = options.parms
		if(parms[5] != undefined) {throw err('Only 3 parameters are allowed')}
    var ApplicationName = parms[2]
    var ApplicationDir = parms[3]
    var Template = options.template
    var Builds = options.builds
    var Sdk = options.sdk
    var Force = options.force
    var NodeAppApplicationTemplatesDir = path.join(NodeAppTemplatesDir + '/Application')

    //console.log('CurrJSFilePath: ' + CurrJSFilePath)
    //console.log('CurrWorkingDir: ' + CurrWorkingDir)
    //console.log('NodeAppBinDir: ' + NodeAppBinDir)
    //console.log('TemplatesDir: ' + TemplatesDir)
    //console.log('NodeAppTemplatesDir: ' + NodeAppTemplatesDir)
    //console.log('ApplicationName: ' + ApplicationName)
    //console.log('ApplicationDir: ' + ApplicationDir)
    //console.log('Template: ' + Template)
    //console.log('Builds: ' + Builds)
    //console.log('Sdk: ' + Sdk)
    //console.log('Force: ' + Force)
    //console.log('NodeAppApplicationTemplatesDir: ' + NodeAppApplicationTemplatesDir)

		if(Template == undefined) {throw '--template parameter is required'}
		if(Sdk == undefined) {throw '--sdk parameter is required'}
		if(ApplicationName == undefined) {throw 'Application Name parameter is empty'}
    if(ApplicationDir == undefined) {throw 'Application Directory parameter is empty'}
    
    //if (!fs.existsSync(Sdk)){throw Sdk + ' sdk folder does not exist'}
    //var TemplateDir = path.join(NodeAppApplicationTemplatesDir + '/' + Template);console.log('TemplateDir: ' + TemplateDir)
    //var TemplateDir = path.join(NodeAppBinDir + '/node_modules/@extjs/apptemplate-' + Template + '/template');console.log('TemplateDir: ' + TemplateDir)
    //var TemplateDir = o.options.templateFull

    var TemplateDir = ''
    if(Template == 'folder') {
      TemplateDir = options.templateFull
    }
    else {
      TemplateDir = path.join(CurrJSFilePath + '/' + TemplatesDir + '/application/' + Template)
    }
    if (!fs.existsSync(TemplateDir)){throw 'Template ' + Template + ' does not exist'}
    if (Force) {
      try {
        fs.removeSync(ApplicationDir)
        util.infLog(ApplicationDir + ' deleted (--force is set)')
      } catch(e) {
        if (e.code == 'EEXIST') throw e;
      }
    }

    if(ApplicationDir != './') {
      fs.mkdirSync(ApplicationDir)
      console.log(`${app} ${ApplicationDir} created`)
    }

    var SdkVal
    var Packages
    var n = Sdk.indexOf("@extjs");
    if (n == -1) {
      SdkVal = 'ext'
      Packages = '$\u007Bworkspace.dir}/packages'
    }
    else {
      SdkVal = Sdk
      Packages = '$\u007Bworkspace.dir}/packages,node_modules/@extjs'
		}

		walkSync(TemplateDir, TemplateDir.length+1, ApplicationDir, ApplicationName, Template, SdkVal, Packages)
    var f
    f='/.sencha';fs.copySync(CurrJSFilePath + '/' + TemplatesDir + '/application' + '/sencha', ApplicationDir + f)
    //console.log(ApplicationDir + f + ' created')
    console.log(`${app} ${f} created`)

    var cmdVersion = options.cmdVersion
    var frameworkVersion = options.frameworkVersion

    var senchaCfg = path.join(ApplicationDir, '.sencha', 'app', 'sencha.cfg');
    fs.readFile(senchaCfg, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      var result = data.replace('{cmdVer}', cmdVersion)
                      .replace('{frameVer}', frameworkVersion);
      fs.writeFileSync(senchaCfg, result, 'utf8', function (err) {
        if (err) return console.log(err);
      })
    })
  }
}
module.exports = generateApp

	// List all files in a directory in Node.js recursively in a synchronous fashion
	//https://gist.github.com/kethinov/6658166
	//const walkSync = (d) => fs.statSync(d).isDirectory() ? fs.readdirSync(d).map(f => walkSync(path.join(d, f)+'\n')) : d;
	function walkSync(dir, len, ApplicationDir, ApplicationName, Template, SdkVal, Packages) {
		var path = path || require('path');
		var fs = fs || require('fs');
		var files = fs.readdirSync(dir);
		files.forEach(function(file) {
			if (fs.statSync(path.join(dir, file)).isDirectory()) {
//        console.log('file (directory): ' + file)
        var all = path.join(dir, file)
        //console.log('all: ' + all)
        var small = all.slice(len)
//        try {
          fs.mkdirSync(ApplicationDir + '/' + small);
        // }
        // catch(e) {
        //   chalk.red('App already exists')
        //   return
        // }
				walkSync(path.join(dir, file), len, ApplicationDir, ApplicationName, Template, SdkVal, Packages);
			}
			else {
//				console.log('file (file): ' + file)
				if (file.substr(file.length - 7) != 'default') { return }
				var i = 'People';//mjg
				iSmall = i.toLowerCase()
				var iCaps = iSmall[0].toUpperCase() + iSmall.substring(1)
				var viewFileName = iCaps + 'View'
				var viewNameSmall = iSmall + 'view'
				const uuidv4 = require('uuid/v4');
				var values = {
					universal: true,
					toolkit: 'modern',
					template: Template,
					frameworkIsV62: true,
					frameworkIsV65: true,
					fwIs60: false,
					themeName: 'default',
					classicTheme: "theme-triton",
					modernTheme: "theme-material",
					appName: ApplicationName,
					name: ApplicationName,
          frameworkKey: 'ext',
          sdkval: SdkVal,
          packages: Packages,
					uniqueId: uuidv4(),
//					modernTheme: "theme-material",
					viewFileName : viewFileName,
					viewName: iSmall + '.' + viewFileName,
					viewNamespaceName: ApplicationName + '.' + 'view.' + iSmall + '.' + viewFileName,
					viewBaseClass: "Ext.panel.Panel",
					viewNameSmall: viewNameSmall
				}
        var all = path.join(dir, file)
        //console.log('all: ' + all)
				var content = fs.readFileSync(all).toString()
				if (file.substr(file.length - 11) == 'tpl.default') { 
					var tpl = new Ext.XTemplate(content)
          var t = tpl.apply(values)
          tpl = null
					var small = all.slice(len)
					var filename = small.substr(0, small.length - (11+1))
					fs.writeFileSync(ApplicationDir + '/' + filename, t);
				}
				else {
					var small = all.slice(len)
					var filename = small.substr(0, small.length - (7+1))
          var theNonTplPath = ApplicationDir + '/' + filename
          //console.log('theNonTplPath: ' + theNonTplPath)
					fs.createReadStream(all).pipe(fs.createWriteStream(theNonTplPath));
				}
			}
		})
	}
var fs = require('fs');
var findInFile = require('./lib/findInFile');
var replaceString = require('./lib/replaceStringInFile');
var dir = require('./lib/dir.js');
var ffPttern = /(font-family\s?:)([^;!]+)?/g;
var argvs = process.argv.slice(2);
var deep = true;
var firstArg, lastArg;

if (argvs.length > 0) {
	if (argvs.length === 2) {
		firstArg = argvs[0];
		lastArg = argvs[argvs.length-1];
		if (/^\d+$/.test(lastArg) && !fs.exists(lastArg)) {
			// get deep argument
			deep = +argvs.pop();
			console.log('\x1b[36m%s\x1b[0m', 'maximum dir depth: ['+ deep + ']\n');
		}
	}
	argvs.forEach(function(path){
		findInFile({
			path: path,
			search: ffPttern,
			replace: replaceFunction,
			fileType: /(css|less|scss)/,
			deep: deep,
			callback: function (err, data) {
				if (err) {
					console.log('[failed] ' + data.filename);
				}
				console.log('[ok] ' + data.filename);
			}
		});
	});
} else {
	console.log('\x1b[36m%s\x1b[0m', '\n=======替换 font-family属性值 脚本=======\n');
	console.log('          ---使用说明---\n'+
		'替换单个文件：node index.js a.css\n'+
		'替换多个文件：node index.js a.css b.css\n'+
		'遍历某文件夹：node index.js .\n'+
		'指定遍历层级：node index.js . 2\n');
}

function replaceFunction (a,b,c,d) {
	var arr = c.replace(/\s?:\s/, '').replace(/\s?;\s?/, '').split(',');
	arr = arr.map(function(string){
		string = string.trim();
		if ( ! /('|")/g.test(string) ) {
			string = string.replace(/(.+)(;?)/g, '"$1"$2'); // '"'+ string + '"';
		}
		return string;
	});
	return b + arr.toString();
}
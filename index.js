var fs = require('fs');
var nativePath = require('path');
var dir = require('./lib/dir.js');
var fileType = /^(css|less|scss)$/;
var argvs = process.argv.slice(2);
var deep = true;
function addQuotationMation (str) {
	var arr = str.split(',');
	arr = arr.map(function(string){
		string = string.trim();
		// if ( ! /('|")/g.test(string) ) {
		// 	string = string.replace(/(.+)(;?)/g, '"$1"$2'); // '"'+ string + '"';
		// }
		if ( /^[^a-zA-z-'"]+/g.test(string) ) {
			string = string.replace(/(.+)(;?)/g, '"$1"$2'); // '"'+ string + '"';
		}
		return string;
	});
	return arr.join(',');
}
var firstArg, lastArg;
var replacements = [
	{
		search: /(font-family\s?:)([^;!}]+)?/g,
		replace: function replaceFunction (a,b,c,d) {
			var str = c.replace(/\s?:\s/, '').replace(/\s?;\s?/, '');

			return b + addQuotationMation(str).toString();
		}
	},
	{
		search: /(font\s?:)([^;!}]+)?/g,
		replace: function (a, b, c) {
			var arr = c.split(/\s/g);
			var ff = arr.pop();
			ff = addQuotationMation(ff);
			arr.push(ff);
			return b + arr.join(' ');
		}
	}
];
if (argvs.length === 0) {
	console.log('\x1b[36m%s\x1b[0m', '\n=======替换 font-family属性值 脚本=======\n');
	console.log('          ---使用说明---\n'+
		'替换单个文件：node index.js a.css\n'+
		'替换多个文件：node index.js a.css b.css\n'+
		'遍历某文件夹：node index.js .\n'+
		'指定遍历层级：node index.js . 2\n');
}


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
	dir(path, {
		callback: function (fname) {
			var ext = nativePath.extname(fname).substr(1);
			if ( !fileType.test( ext ) ) {
				return;
			}
			replaceFile(fname, replacements);
		},
		deep: deep,
		searchHiddenFile: false
	});
});

function replaceFile(fname, replacements){
	fs.readFile(fname, function (err, data) {
		if (err) {
			throw err;
		}
		data = data.toString();
		for (var i = 0; i < replacements.length; i++) {
			var r = replacements[i];
			if (r.search && r.replace) {
				data = data.replace(r.search, r.replace);
			}
			// replaceString(fname, r.search, r.replace, callback);
		}

		fs.writeFile(fname, data, function(err){
			if (err) {
				throw err;
			}
		});
	});
}
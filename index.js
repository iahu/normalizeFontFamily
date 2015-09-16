var fs = require('fs');
var jschardet = require("jschardet");
var deepDir = require('./lib/deepDir.js');
var argvs = process.argv.slice(2);
var depth = 0;
var infoPrefix = '\x1b[33m[info] \x1b[0m';
var firstArg, lastArg;
var replacements = [
	{
		search: /(font-family\s?:)([^;!}]+)?/g,
		replace: function replaceFunction (a,b,c,d) {
			var str = c.replace(/\s?:\s/, '').replace(/\s?;\s?/, '');

			return b + addQuote(str).toString();
		}
	},
	{
		search: /([^a-zA-Z-\s'"])(font\s?:)([^;!}]+)?/g,
		replace: function (a, b, c, d) {
			var arr = d.split(/\s/g);
			var ff = arr.pop();
			ff = addQuote(ff);
			arr.push(ff);
			return b + c + arr.join(' ');
		}
	}
];
if (argvs.length === 0) {
	console.log('\x1b[31m'+ '\n=======替换 font-family属性值 脚本=======\x1b[0m');
	console.log('          ---使用说明---\n'+
		'替换单个文件：node index.js a.css\n'+
		'替换多个文件：node index.js a.css b.css\n'+
		'遍历某文件夹：node index.js .\n'+
		'指定遍历层级：node index.js . 2\n');
}


if (argvs.length === 2) {
	firstArg = argvs[0];
	lastArg = argvs[argvs.length-1];
	if (/^\d+$/.test(lastArg) && !fs.existsSync(lastArg)) {
		depth = +argvs.pop();
		console.log(infoPrefix+'最大遍历深度：'+ depth);
	}
}

argvs.forEach(function(path){
	deepDir(path, {
		filters: {
			'.css' : cssFilter,
			'.scss': cssFilter,
			'.less': cssFilter
		},
		depth: depth
	});
});

function cssFilter(fname){
	console.log(infoPrefix+'正在处理:', fname);
	fs.readFile(fname, function (err, data) {
		if (err) {
			throw err;
		}
		var encoding = jschardet.detect(data).encoding;
		if (['UTF-8', 'ascii'].indexOf(encoding) < 0) {
			// console.log(infoPrefix+'未处理'+fname+'，文件编码:', encoding);
			encoding = 'utf8';
			return;
		}
		if (encoding === 'UTF-8') {
			encoding = 'utf8';
		}
		var originalData = data = data.toString(encoding);
		for (var i = 0; i < replacements.length; i++) {
			var r = replacements[i];
			data = data.replace(r.search, r.replace);
		}
		if (data === originalData) {
			return;
		}
		fs.writeFile(fname, data, encoding, function(err){
			if (err) {
				console.log(err);
				// throw err;
			}
		});
	});
}

function addQuote (str) {
	var arr = str.split(',');
	arr = arr.map(function(string){
		var matchs = string.match(/(\s?)(.+)(;?\s?)/);
		var str = string.trim();
		if ( ! quoted(str) && ! keyword(str) && !dimension(str) ) {
			str = str.replace(/(.+)(;?)/g, '"$1"$2');
			// str = '"'+ str + '"';
			if (matchs) {
				return matchs[1]+ str + matchs[3];
			}
			return str;
		}
		return string;
	});
	return arr.join(',');
}

function quoted (string) {
	return /['"]([^'"]+)['"]/.test(string);
	// return /^"((?:[^"\\\r\n]|\\.)*)"|'((?:[^'\\\r\n]|\\.)*)'/.test(string);
}
function keyword (string) {
	return /^%|^[_A-Za-z-][_A-Za-z0-9-]*/.test(string);
}
function dimension (string) {
	return /^([+-]?\d*\.?\d+)(%|[a-z]+)?/.test(string);
}
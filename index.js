var fs = require('fs');
var replaceString = require('./src/replaceString');
var dir = require('./src/dir.js');
var ffPartten = /(font-family\s?:)(.+)?([;}]?)/g;
var argvs = process.argv.slice(2);
var deep = true;
if (argvs.length > 0) {
	if (argvs.length === 2 && /^\d+$/.test(argvs[argvs.length-1]) ) {
		// get deep argument
		deep = +argvs.pop();
	}
	argvs.forEach(function(filename){
		dir(filename, function(fname){
			if ( fname.split('.').pop() !== 'css' ) {
				return;
			}
			// console.log(fname);
			replaceFile(fname);
		}, deep);
	});
} else {
	console.log('\n=======替换 font-family属性值 脚本=======\n');
	console.log('          ---使用说明---');
	console.log('替换单个文件：node index.js a.css');
	console.log('替换多个文件：node index.js a.css b.css');
	console.log('遍历某文件夹：node index.js .');
	console.log('指定遍历层级：node index.js . 2');
}

function replaceFunction (a,b,c,d) {
	var arr = c.replace(/\s?:\s/, '').replace(/\s?;\s?/, '').split(',');
	arr = arr.map(function(string, index){
		string = string.trim();
		if ( ! /('|")/g.test(string) ) {
			string = string.replace(/(.+)(;?)/g, '"$1"$2'); // '"'+ string + '"';
		}
		return string;
	});
	return b + arr.toString() + d + ';';
}

function replaceFile (filename) {
	console.log(filename +' processing.');
	replaceString(filename, ffPartten, replaceFunction, function (err) {
		if (err) {
			console.log(filename+' processing failed');
		} else{
			console.log(filename+ ' processing successed');
		}
	});
}
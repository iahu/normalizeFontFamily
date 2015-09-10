var fs = require('fs');
var replaceString = require('./replaceString');
var dir = require('./dir.js');
var ffPartten = /(font-family\s?:)(.+)?([;}]?)/g;
var argvs = process.argv.slice(2);

if (argvs.length > 0) {
	argvs.forEach(function(filename){
		dir(filename, function(fname){
			if ( fname.split('.').pop() !== 'css' ) {
				return;
			}
			// console.log(fname);
			replaceFile(fname);
		}, true);
	});
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
			console.log(filename+' replace false');
		} else{
			console.log(filename+ ' replace success');
		}
	});
}
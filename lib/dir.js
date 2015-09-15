var fs = require('fs');
var nativePath = require('path');
// var winAttr = require('winattr');
var attr = require('./attr');
var deepCount = 0;
var overflow = false;
var isWin = require('./isWin')();
var sep = isWin ? '/' : '/';

module.exports = function dir(path, option) {
	var exists = fs.existsSync(path);
	var deep = option.deep || false,
		searchHiddenFile = option.searchHiddenFile || false,
		filter = option.callback || function(){};
	if ( !exists ) {
		throw new Error(path + ' not found.');
	}

	attr.get(path, function (err, attrs) {
		if (err) {
			throw err;
		}
		if (attrs.readonly || (!searchHiddenFile && attrs.hidden)) {
			console.log('已忽略文件:', path);
			console.log('文件属性:', attrs);
			return;
		}

		if ( fs.statSync(path).isFile() ) {
			filter(path);
			return;
		}
		// directory path normalize
		if (path.substr(-1) !== sep) path += sep;
		console.log('\ngoto directory:\n'+ path);
		fs.readdir(path, function(err, files){
			if (err) {
				throw err;
			}
			if (files && files.length < 0) {
				return;
			}
			files.forEach(function (file) {
				var subPath = path + file;

				if (deep) {
					if (typeof deep === 'number') {
						if (overflow) {
							return;
						}
						deepCount = subPath.replace(/(.\/|.\\)/, '')
							.replace(/[\\|\/]$/, '')
							.split(/[\\\/]/g).length;
						if (deepCount > deep) {
							// console.log('\x1b[36m%s\x1b[0m', 'overflow maximum dir depth: ['+ deep + ']\n');
							overflow = true;
							return;
						}
					}

					return dir(subPath, {
						callback: filter, 
						deep: deep
					});
				}
			});
		});
	})
};
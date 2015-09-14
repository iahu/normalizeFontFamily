var fs = require('fs');
var nativePath = require('path');
var winAttr = require('winattr');
var deepCount = 0;
var overflow = false;

module.exports = function dir(path, option) {
	var exists = fs.existsSync(path);
	var deep = option.deep || false,
		searchHiddenFile = option.searchHiddenFile || false,
		filter = option.callback || function(){};
	if ( !exists ) {
		throw new Error(path + ' not found.');
	}

	winAttr.get(path, function (err, attrs) {
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
		if (path.substr(-1) !== '/') path += '/';

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
							.replace(/[\\|\/]/, '')
							.split(/[\\\/]/g).length;
						// console.log( pathList, deepCount );
						if (deepCount > deep) {
							// console.log('\x1b[36m%s\x1b[0m', 'overflow maximum dir depth: ['+ deep + ']\n');
							overflow = true;
							return;
						}
					}

					// console.log('\ngoto directory:\n'+ subPath);
					return dir(subPath, {
						callback: filter, 
						deep: deep
					});
				}

				// fs.stat(subPath, function (err, stat) {
				// 	if (err) {
				// 		throw err;
				// 	}


				// 	if (deep) {
				// 		if (typeof deep === 'number') {
				// 			if (overflow) {
				// 				return;
				// 			}
				// 			if (deepCount > deep) {
				// 				console.log('\x1b[36m%s\x1b[0m', 'overflow maximum dir depth: ['+ deep + ']\nexited');
				// 				overflow = true;
				// 				return;
				// 			}
				// 		}

				// 		deepCount += 1;
				// 		return dir(subPath, filter, deep);
				// 		// winAttr.get(subPath, function (err, attrs) {
				// 		// 	if (attrs.readonly || (!searchHiddenFile && attrs.hidden)) {
				// 		// 		console.log('已忽略:', subPath);
				// 		// 		// console.log('文件属性:', attrs);
				// 		// 		return;
				// 		// 	}

				// 		// 	deepCount += 1;
				// 		// 	console.log('\ngoto directory:\n'+ subPath);
				// 		// 	dir(subPath, filter, deep);
				// 		// });
				// 	}
				// });
			});
		});
	})
};
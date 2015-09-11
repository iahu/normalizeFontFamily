var fs = require('fs');
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
			if ( !fs.existsSync(subPath) ) {console.log(file + ' not fount.');return;}
			fs.stat(subPath, function (err, stat) {
				if (err) {
					throw err;
				}

				if (stat.isFile()) {
					filter(subPath);
				} else {
					if (deep) {
						if (typeof deep === 'number') {
							if (overflow) {
								return;
							}
							if (deepCount > deep) {
								console.log('\x1b[36m%s\x1b[0m', 'overflow maximum dir depth: ['+ deep + ']\nexited');
								overflow = true;
								return;
							}
						}
						deepCount += 1;
						console.log('\ngoto directory:\n'+ subPath);
						dir(subPath + '/', filter, deep);
					}
				}
			});
		});
	});
};
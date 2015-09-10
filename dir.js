var fs = require('fs');

module.exports = function dir(path, filter, deep) {
	var exists = fs.existsSync(path);
	if (path.substr(-1) !== '/') path += '/';
	if ( !exists ) {
		throw new Error(path + ' not found.');
	}
	filter = typeof filter === 'function'? filter : function(){};
	fs.readdir(path, function(err, files){
		if (err) {
			throw err;
		}
		// console.log('\nscaning "'+ path);
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
				// console.log(file ,'is file?', stat.isFile());

				if (stat.isFile()) {
					// console.log(subPath+' is file');
					filter(subPath);
				} else {
					// console.log(subPath+'is directory');
					if (deep) {
						// console.log('goto '+ subPath);
						dir(subPath + '/', filter, deep);
					}
				}
			});
		});
	});
};
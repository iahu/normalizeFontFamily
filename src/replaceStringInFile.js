var fs = require('fs');

function isRegExt (s) {
	return Object.prototype.toString.call(s) === '[object RegExp]';
}

function replaceStringInFile (filename, find, replace, cb) {
	cb = typeof cb === 'function'? cb : function () {};
	fs.exists(filename, function (exists) {
		if (!exists) {
			console.log(filename+' not found.');
		}
		var data = fs.readFileSync(filename, 'utf-8');
		var pattern = isRegExt(find)? find : new RegExp(find, 'g');
		data = data.replace(pattern, replace);

		fs.writeFile(filename, data, function(err){
			if (err) {
				throw err;
			}
			cb(err, {filename: filename, data: data});
		});
	});
}

module.exports = replaceStringInFile;
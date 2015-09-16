var util = require('util');
var EventEmitter  = require('events').EventEmitter;
var fs = require('fs');
var nativePath = require('path');
var nativeSep = nativePath.sep;
var basePathDepth = 0;
function deepDir (path, config) {
	if ( !(this instanceof deepDir) ) {
		return new deepDir(path, config);
	}
	var that = this;
	EventEmitter.call(that);
	that.config = config = config || {};
	var maxPathDepth = config.depth;

	fs.exists(path, function(exists){
		if (!exists) {
			console.log('dir path not exists: ', path);
		} else {
			basePathDepth = getPathDepth(path, nativeSep);
			this.goThrough(path, maxPathDepth, basePathDepth);
		}
	}.bind(this) );

	this.on('goThrogh.isFile', function(path) {
		var ext = nativePath.parse(path).ext;
		var filters = config.filters;
		if ( filters.hasOwnProperty(ext) ) {
			filters[ext].call(this, path);
		}
	}.bind(this) );
}
util.inherits(deepDir, EventEmitter);

function goThrough (path, maxPathDepth, basePathDepth) {
	var that = this;
	fs.stat(path, function (err, stat) {
		if (stat.isFile()) {
			that.emit('goThrogh.isFile', path);
		} else {
			if (maxPathDepth && (getPathDepth(path, nativeSep) - basePathDepth) >= maxPathDepth  ) {
				return;
			}

			fs.readdir(path, function(err, files){
				if (err) {
					console.log('can\'t read directory:', path);
					console.log(err);
					return;
				}
				files.forEach(function (filename) {
					goThrough.call(that, nativePath.join(path, filename), maxPathDepth, basePathDepth);
				});
			});
		}
	});
}
deepDir.prototype.goThrough = goThrough;

function getPathDepth (path, sep) {
	return path.split(sep).length;
}

module.exports = deepDir;
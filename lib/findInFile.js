var nativePath = require('path');
var dir = require('./dir');
var extend = require('./extend');
var replaceString = require('./replaceStringInFile');

module.exports = function (option) {
	var opts = extend({
		path: '',
		search: '',
		replace: '',
		fileType: /.+/i,
		deep: true,
		searchHiddenFile: false,
		callback: function () {}
	}, option);
	var search = opts.search,
		replace = opts.replace,
		searchHiddenFile = opts.searchHiddenFile,
		fileType = opts.fileType,
		fileTypePattern = (typeof fileType === 'string') ? new RegExp('^'+fileType + '$', 'i') : fileType,
		callback = opts.callback;

	dir(opts.path, {
		callback: function(fname){
			if ( fileTypePattern.test( nativePath.extname(fname).substr(1) ) ) {
				replaceString(fname, search, replace, callback);
			}
		},
		deep: opts.deep,
		searchHiddenFile: searchHiddenFile
	});
};
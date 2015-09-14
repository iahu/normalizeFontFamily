var isWin = require('os').platform().toLowerCase().indexOf('win') >= 0;
var winAttr = require('winattr');
var isUnixHiddenPath = function (path) {
	return (/(^|\/)\.[^\/\.]/g).test(path);
};
var checkPermission = function (file, mask, cb){
    fs.stat (file, function (error, stats){
        if (error){
            cb (error, false);
        }else{
            cb (null, !!(mask & parseInt ((stats.mode & parseInt ("777", 8)).toString (8)[0])));
        }
    });
};

if (isWin) {
	module.exports = winAttr;
} else {
	module.exports = {
		get: function (path, fn) {
			checkPermission(path, 2, function (readonly) {
				fn({
					hidden: isUnixHiddenPath(path),
					readonly: readonly
				});
			});
		}
	};
}
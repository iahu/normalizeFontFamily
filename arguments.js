module.exports = function (argv) {
	var args = {}, keyCount = 0, skip = false;
	argv.forEach(function(arg, index){
		var key, value;
		if (skip) {
			skip = false;
			return;
		}
		if (arg.charAt(0) === '-') {
			key = arg.substr(1);
			value = argv[index+1];
			skip = true;
		} else {
			key = keyCount;
			keyCount += 1;
			value = arg;
		}
		args[key] = value;
	});

	return args;
};
module.exports = function () {
	return require('os').platform().toLowerCase().indexOf('win') === 0;
};
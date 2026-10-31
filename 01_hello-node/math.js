function add(a, b) {
	return a + b;
}

function sub(a, b) {
	return a - b;
}

// Export the functions so it can be used in other files
module.exports = {
	add,
	sub,
};

exports.mul = (a, b) => a * b;

exports.div = (a, b) => a / b;
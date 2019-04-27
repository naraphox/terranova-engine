var base64 = {
	"encode": (d) => {
		let buff = new Buffer(d);
		let base64data = buff.toString('base64');
		return base64data;
	},
	"decode": (d) => {
		let buff = new Buffer(d, 'base64');
		let text = buff.toString('ascii');
		return text;
	}
};
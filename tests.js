
var instagram = require('./index.js').createClient('a8d764b1a7fe4089959910ee6bdcedce',
						   '253a2b9abade4f25adb3825249d98b85');


exports.testMediaFetchById = function (test) {
    test.expect(2);

    instagram.media(100, function (media, error) {
	test.ok(media['type']);
	test.equal(error, null, "Returned an error");

	test.done();
    });
}
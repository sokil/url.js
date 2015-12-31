describe("Mutate suite", function() {
    var UrlMutator = require('../../src/UrlMutator.js');

    it("merge query string to url with no query", function() {
        expect(
            "http://github.com/sokil?param=value"
        ).toEqual(
            UrlMutator.create('http://github.com/sokil')
                .appendQueryParams({"param": "value"})
                .toString()
        );
    });

    it("merge query string to url with query", function() {
        expect(
            "http://github.com/sokil?param1=value1&param2=value2"
        ).toEqual(
            UrlMutator.create('http://github.com/sokil?param1=value1')
                .appendQueryParams({"param2": "value2"})
                .toString()
        );
    });

    it("change scheme", function() {
        var url = UrlMutator.create('http://github.com/sokil?param1=value1');
        url.scheme = 'https';

        expect(
            "https://github.com/sokil?param1=value1"
        ).toEqual(
            url.toString()
        );
    });
});
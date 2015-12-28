describe("Url suite", function() {
    var Url = require('../../src/Url.js');

    it("converts 'param=value' to object", function() {
        expect(
            {"param": "value"}
        ).toEqual(
            Url.stringToObject('param=value')
        );
    });

    it("converts 'param[]=value' to object", function() {
        expect(
            {"param": {"0": "value"}}
        ).toEqual(
            Url.stringToObject('param[]=value')
        );
    });

    it("converts 'param[]=value1&param[]=value2' to object", function() {
        expect(
            {"param": {"0": "value1", "1": "value2"}}
        ).toEqual(
            Url.stringToObject('param[]=value1&param[]=value2')
        );
    });

    it("converts 'param[key]=value' to object", function() {
        expect(
            {"param": {"key": "value"}}
        ).toEqual(
            Url.stringToObject('param[key]=value')
        );
    });

    it("converts 'param[key1]=value1&param[key2]=value2' to object", function() {
        expect(
            {"param": {"key1": "value1", "key2": "value2"}}
        ).toEqual(
            Url.stringToObject('param[key1]=value1&param[key2]=value2')
        );
    });

    it("converts encoded value with spaces to object", function() {
        expect(
            {"param": "Зроблено в Україні"}
        ).toEqual(
            Url.stringToObject('param=%D0%97%D1%80%D0%BE%D0%B1%D0%BB%D0%B5%D0%BD%D0%BE%20%D0%B2%20%D0%A3%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D1%96')
        );
    });

    it("converts value with plus sign to object", function() {
        expect(
            {"param": "1 1"}
        ).toEqual(
            Url.stringToObject('param=1+1')
        );
    });

    it("converts value with encoded plus sign to object", function() {
        expect(
            {"param": "1+1"}
        ).toEqual(
            Url.stringToObject('param=1%2B1')
        );
    });

    it("merge query string to url with no query", function() {
        expect(
            "http://github.com/sokil?param=value"
        ).toEqual(
            Url('http://github.com/sokil')
                .merge({"param": "value"})
                .toString()
        );
    });

    it("merge query string to url with query", function() {
        expect(
            "http://github.com/sokil?param1=value1&param2=value2"
        ).toEqual(
            Url('http://github.com/sokil?param1=value1')
                .merge({"param2": "value2"})
                .toString()
        );
    });
});
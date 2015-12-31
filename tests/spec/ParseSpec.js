describe("parse suite", function() {
    var UrlMutator = require('../../src/UrlMutator.js');

    it("wrong url", function() {
        expect(function() {
            UrlMutator.create("this-is-not-url")
        }).toThrow(
            new Error('Invalid url')
        );
    });

    it("parse full url", function() {
        var url = UrlMutator.create("https://user:pass@github.com:80/sokil/url.js.git?param[]=value&param2=value#hash");
        expect(
            {
                "scheme": 'https',
                "user": "user",
                "password": "pass",
                "host": "github.com",
                "port": 80,
                "path": '/sokil/url.js.git',
                "queryString": "param[]=value&param2=value",
                "fragment": "hash"
            }
        ).toEqual(
            {
                "scheme": url.scheme,
                "user": url.user,
                "password": url.password,
                "host": url.host,
                "port": url.port,
                "path": url.path,
                "queryString": url.queryString,
                "fragment": url.fragment
            }
        );
    });

    it("parse full url no password", function() {
        var url = UrlMutator.create("https://user@github.com:80/sokil/url.js.git?param[]=value&param2=value#hash");
        expect(
            {
                "scheme": 'https',
                "user": "user",
                "password": undefined,
                "host": "github.com",
                "port": 80,
                "path": '/sokil/url.js.git',
                "queryString": "param[]=value&param2=value",
                "fragment": "hash"
            }
        ).toEqual(
            {
                "scheme": url.scheme,
                "user": url.user,
                "password": url.password,
                "host": url.host,
                "port": url.port,
                "path": url.path,
                "queryString": url.queryString,
                "fragment": url.fragment
            }
        );
    });

    it("parse full url no port", function() {
        var url = UrlMutator.create("https://user:pass@github.com/sokil/url.js.git?param[]=value&param2=value#hash");
        expect(
            {
                "scheme": 'https',
                "user": "user",
                "password": "pass",
                "host": "github.com",
                "port": undefined,
                "path": '/sokil/url.js.git',
                "queryString": "param[]=value&param2=value",
                "fragment": "hash"
            }
        ).toEqual(
            {
                "scheme": url.scheme,
                "user": url.user,
                "password": url.password,
                "host": url.host,
                "port": url.port,
                "path": url.path,
                "queryString": url.queryString,
                "fragment": url.fragment
            }
        );
    });

    it("parse full url no path", function() {
        var url = UrlMutator.create("https://github.com");
        expect(
            {
                "scheme": 'https',
                "user": undefined,
                "password": undefined,
                "host": "github.com",
                "port": undefined,
                "path": undefined,
                "queryString": undefined,
                "fragment": undefined
            }
        ).toEqual(
            {
                "scheme": url.scheme,
                "user": url.user,
                "password": url.password,
                "host": url.host,
                "port": url.port,
                "path": url.path,
                "queryString": url.queryString,
                "fragment": url.fragment
            }
        );
    });
});
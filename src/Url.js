(function(context, factory) {
    if (typeof define === 'function' && define.amd) {
        define('upload', function () {
            return (context['Url'] = factory());
        });
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        context['Url'] = factory();
    }
})(this, function() {

    // consctructor
    var urlConstructor = function(url) {
        this.url = url;
    };

    urlConstructor.prototype = {

        merge: function(params) {
            if(!params) {
                return this;
            }

            var hostAndPath,
                queryObject,
                queryMarkPos = this.url.indexOf('?');

            if(queryMarkPos > 0) {
                queryObject = Url.stringToObject(this.url.substr(queryMarkPos + 1));
                hostAndPath = this.url.substr(0, queryMarkPos);
            } else {
                queryObject = {};
                hostAndPath = this.url;
            }

            if("object" !== typeof params) {
                params = Url.stringToObject(params);
            }

            // merge
            queryObject = Url.merge(queryObject, params);

            // update url
            this.url = hostAndPath + '?' + Url.objectToString(queryObject);

            return this;
        },

        toString: function() {
            return this.url;
        }
    };

    // global factory
    var Url = function(url) {
        return new urlConstructor(url);
    };

    Url.stringToObject = function(queryString) {
        queryString = decodeURIComponent(queryString.replace(/\+/g, '%20'));

        var queryArray = {},
            queryPairs = queryString.split('&'),
            numericIndexCounter = {};

        for(var i in queryPairs) {
            var queryPair = queryPairs[i].split('='),
                queryPairKey = queryPair[0],
                queryPairValue = queryPair[1];

            var arrayKey = queryPairKey.match(/([^=&]+?)\[(.*)\]/);

            // param[]=value
            if(arrayKey) {
                var arrayKeyName = arrayKey[1],
                    arrayKeyIndexList = arrayKey[2].split("][");

                if(!queryArray[arrayKeyName]) {
                    queryArray[arrayKeyName] = {};
                    numericIndexCounter[arrayKeyName] = {};
                }

                var pointer = queryArray[arrayKeyName];

                for(var j = 0; j < arrayKeyIndexList.length; j++) {
                    // get index
                    var arrayKeyIndex = arrayKeyIndexList[j];
                    if(!arrayKeyIndex) {
                        if(j === 0) {
                            if(!numericIndexCounter[arrayKeyName][j]) {
                                numericIndexCounter[arrayKeyName][j] = 0;
                            }
                            arrayKeyIndex = numericIndexCounter[arrayKeyName][j]++;
                        } else {
                            arrayKeyIndex = 0;
                        }
                    }

                    // set pointer
                    if(j === arrayKeyIndexList.length - 1) {
                        pointer[arrayKeyIndex] = queryPairValue;
                    } else {
                        if(!pointer[arrayKeyIndex]) {
                            pointer[arrayKeyIndex] = {};
                        }
                        pointer = pointer[arrayKeyIndex];
                    }
                }
            }
            // param=value
            else {
                queryArray[queryPairKey] = queryPairValue;
            }
        }

        return queryArray;
    };

    Url.objectToString = function(array, keyPrefix) {
        var pairs = [];
        for(var key in array) {
            var value = array[key];

            // get full key
            var fullKey;
            if(keyPrefix) {
                fullKey = keyPrefix + '[' + key + ']';
            }
            else {
                fullKey = key;
            }

            if(typeof value === 'object') {
                pairs.push(this._queryArrayToString(value, fullKey));
            } else {
                pairs.push(fullKey + '=' + value);
            }
        }

        return pairs.join('&');
    };

    Url.merge = function() {
        var merged = {}, key;

        for(var i = 0; i < arguments.length; i++) {
            for(key in arguments[i]) {
                if(merged[key] && typeof arguments[i][key] === 'object') {
                    merged[key] = Url.merge(merged[key], arguments[i][key])
                }
                else {
                    merged[key] = arguments[i][key];
                }
            }
        }

        return merged;
    };

    return Url;
});

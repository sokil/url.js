(function(context, factory) {
    if (typeof define === 'function' && define.amd) {
        define('UrlMutator', function () {
            return (context['UrlMutator'] = factory());
        });
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        context['UrlMutator'] = factory();
    }
})(this, function() {

    /**
     * Helper functions
     */
    var helper = {
        /**
         * Merge objects to one object
         * @returns {{}}
         */
        merge: function() {
            var merged = {}, key;

            for(var i = 0; i < arguments.length; i++) {
                for(key in arguments[i]) {
                    if(merged[key] && typeof arguments[i][key] === 'object') {
                        merged[key] = this.merge(merged[key], arguments[i][key])
                    }
                    else {
                        merged[key] = arguments[i][key];
                    }
                }
            }

            return merged;
        }
    };

    // consctructor
    var UrlMutator = function(url) {
        var matches = url.match(/^([^:]+):\/\/(([^:]+)(:(.+))?@)?([^:\/]+)(:(\d+))?((\/[^?#]*)(\?([^#]+))?(#(.+))?)?$/);
        if (!matches) {
            throw new Error('Invalid url')
        }

        this.scheme         = matches[1];
        this.user           = matches[3];
        this.password       = matches[5];
        this.host           = matches[6];
        this.port           = matches[8] ? parseInt(matches[8]) : undefined;
        this.path           = matches[10];
        this.queryString    = matches[12];
        this.fragment       = matches[14];
    };

    UrlMutator.prototype = {

        appendQueryParams: function(params) {
            if(!params) {
                return this;
            }

            if("object" !== typeof params) {
                params = UrlMutator.unserializeQuery(params);
            }

            var queryParams;

            if (this.queryString) {
                queryParams = helper.merge(
                    UrlMutator.unserializeQuery(this.queryString),
                    params
                );
            } else {
                queryParams = params;
            }

            this.queryString = UrlMutator.serializeQuery(queryParams);

            return this;
        },

        toString: function() {
            var userInfo = '';
            if (this.user) {
                userInfo += this.user;

                if (this.password) {
                    userInfo += ':' + this.password;
                }

                userInfo += '@';
            }

            var port = '';
            if (this.port && this.port !== 80) {
                port += ':' + this.port;
            }

            var queryString = '';
            if (this.queryString) {
                queryString += '?' + this.queryString;
            }

            var fragment = '';
            if (this.fragment) {
                fragment += '#' + this.fragment;
            }

            return this.scheme + '://' + userInfo + this.host + port + this.path + queryString + fragment;
        }
    };

    /**
     * Factory method creates mutator object
     * @param url
     * @returns {UrlMutator}
     */
    UrlMutator.create = function(url) {
        return new UrlMutator(url);
    };

    /**
     * Convert object from query string
     * @param queryString
     * @returns {{}}
     */
    UrlMutator.unserializeQuery = function(queryString) {
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

    /**
     * Create query string from object
     * @param array
     * @param keyPrefix
     * @returns {string}
     */
    UrlMutator.serializeQuery = function(array, keyPrefix) {
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
                pairs.push(UrlMutator.serializeQuery(value, fullKey));
            } else {
                pairs.push(fullKey + '=' + value);
            }
        }

        return pairs.join('&');
    };

    return UrlMutator;
});

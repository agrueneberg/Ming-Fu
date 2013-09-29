(function () {
    "use strict";

    var ajax, ming;

    ajax = function (options, callback) {
        var xhr, url;
        xhr = new XMLHttpRequest();
        url = options.url;
        Object.keys(options.params || {}).forEach(function (param, i) {
            if (i === 0) {
                url += "?";
            } else {
                url += "&";
            }
            url += param + "=" + encodeURIComponent(options.params[param]);
        });
        xhr.open(options.method, url);
        if (options.username && options.password) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(options.username + ":" + options.password));
        }
        if (options.connectionString) {
            xhr.setRequestHeader("X-Connection-String", options.connectionString);
        }
        Object.keys(options.headers || {}).forEach(function (name) {
            xhr.setRequestHeader(name, options.headers[name]);
        });
        xhr.onload = function () {
            var headers;
            if (xhr.status >= 200 && xhr.status < 300) {
                headers = {};
                xhr.getAllResponseHeaders().split("\n").filter(function (responseHeader) {
                    return responseHeader !== "";
                }).forEach(function (responseHeader) {
                    var pair, name;
                    pair = responseHeader.split(": ");
                    name = pair[0].toLowerCase();
                    if (headers.hasOwnProperty(name) === false) {
                        headers[name] = pair[1];
                    }
                });
                callback(null, {
                    status: xhr.status,
                    headers: headers,
                    body: xhr.responseText
                });
            } else {
                callback({
                    status: xhr.status,
                    message: xhr.statusText
                }, null);
            }
        };
        xhr.send(options.body || null);
    };

    ming = function (options) {
        options = options || {};
        if (options.hasOwnProperty("endpoint") === false) {
            throw new Error("Please provide an 'endpoint' parameter.");
        } else {
         // Trim trailing '/'.
            if (options.endpoint.charAt(options.endpoint.length - 1) === "/") {
                options.endpoint = options.endpoint.substring(0, options.endpoint.length);
            }
        }
        return {
            collection: function (collection, callback) {
                setTimeout(function () {
                    callback(null, {
                        find: function (query, opts, callback) {
                            if (typeof opts === "function") {
                                callback = opts;
                                opts = {};
                            }
                            ajax({
                                method: "POST",
                                url: options.endpoint + "/" + collection + "/query",
                                params: opts,
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(query),
                                username: options.username,
                                password: options.password,
                                connectionString: options.connectionString
                            }, function (err, res) {
                                var docs;
                                docs = JSON.parse(res.body);
                                callback(err, docs);
                            });
                        },
                        findOne: function (id, callback) {
                            ajax({
                                method: "GET",
                                url: options.endpoint + "/" + collection + "/" + id,
                                username: options.username,
                                password: options.password,
                                connectionString: options.connectionString
                            }, function (err, res) {
                                var rep;
                                rep = JSON.parse(res.body);
                                callback(err, rep);
                            });
                        },
                        insert: function (doc, callback) {
                            ajax({
                                method: "POST",
                                url: options.endpoint + "/" + collection,
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(doc),
                                username: options.username,
                                password: options.password,
                                connectionString: options.connectionString
                            }, function (err, res) {
                                if (err !== null) {
                                    callback(err, null);
                                } else {
                                    callback(null, {
                                        id: res.headers.location.substring(("/" + collection + "/").length, res.headers.location.length)
                                    });
                                }
                            });
                        },
                        update: function (id, update, callback) {
                            ajax({
                                method: "PUT",
                                url: options.endpoint + "/" + collection + "/" + id,
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(update),
                                username: options.username,
                                password: options.password,
                                connectionString: options.connectionString
                            }, function (err, res) {
                                callback(err);
                            });
                        },
                        remove: function (id, callback) {
                            ajax({
                                method: "DELETE",
                                url: options.endpoint + "/" + collection + "/" + id,
                                username: options.username,
                                password: options.password,
                                connectionString: options.connectionString
                            }, function (err, res) {
                                callback(err);
                            });
                        }
                    });
                }, 0);
            },
            grid: function (prefix, callback) {
                setTimeout(function () {
                    callback(null, {
                        put: function (blob, contentType, callback) {
                         // Provide default content type.
                            if (typeof contentType === "function") {
                                callback = contentType;
                                contentType = "application/octet-stream";
                            }
                            ajax({
                                method: "POST",
                                url: options.endpoint + "/" + prefix + ".files",
                                headers: {
                                    "Content-Type": contentType
                                },
                                body: blob,
                                username: options.username,
                                password: options.password,
                                connectionString: options.connectionString
                            }, function (err, res) {
                                if (err !== null) {
                                    callback(err, null);
                                } else {
                                    callback(null, {
                                        id: res.headers.location.substring(("/" + prefix + ".files/").length, res.headers.location.length)
                                    });
                                }
                            });
                        }
                    });
                }, 0);
            }
        };
    };

    window.ming = ming;

}());

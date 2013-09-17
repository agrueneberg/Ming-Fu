Ming Fu
=======

A Browser Client for [Ming](https://bitbucket.org/agrueneberg/ming), the Quasi-RESTful Web Service for MongoDB.

Status
------

Just an experiment. It probably won't make you happy. Move along, there is nothing to see here.

Requirements
------------

- A running Ming instance

Usage
-----

### Embed Client

    <script src="ming-fu.js"></script>

### Connect to Ming

    db = ming({
        endpoint: "myDeployment",
        username: "myUsername",
        password: "myPassword"
    });

### Documents

#### Read

    db.collection("myCollection", function (err, collection) {
        collection.findOne("myId", function (err, doc) {
            console.log(doc);
        });
    });

#### Query

    db.collection("myCollection", function (err, collection) {
        collection.find({
            name: "Ming"
        }, function (err, docs) {
            console.log(docs);
        });
    });

    db.collection("myCollection", function (err, collection) {
        collection.find({}, {
            sort: "name",
            limit: 2,
            skip: 2
        }, function (err, docs) {
            console.log(docs);
        });
    });

#### Create

    doc = {
        name: "Ming"
    };
    db.collection("myCollection", function (err, collection) {
        collection.insert(doc, function (err, response) {
            console.log(response.id);
        });
    });

#### Update

    update = {
        $set: {
            platform: "node"
        }
    };
    db.collection("myCollection", function (err, collection) {
        collection.update("myId", update, function (err) {
            console.log("Updated");
        });
    });

#### Delete

    db.collection("myCollection", function (err, collection) {
        collection.remove("myId", function (err) {
            console.log("Deleted");
        });
    });

### Files

#### Create

See `examples/file-upload.html` for an example based on HTML forms.

    db.grid("fs", function (err, grid) {
        grid.put(blob, "image/jpeg", function (err, response) {
            console.log(response.id);
        });
    });

Advanced
--------

### Proxy to other MongoDB instances

Ming has to be started with `enable-proxying` set to `true` for this feature to work. Then, specify the connection string when connecting to Ming as follows:

    db = ming({
        endpoint: "myDeployment",
        username: "myUsername",
        password: "myPassword",
        connectionString: "mongodb://localhost/test"
    });

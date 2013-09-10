Ming Fu
=======

A Browser Client for Ming, the Quasi-RESTful Web Service for MongoDB.

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
        mongodb: "mongodb://localhost/test"
    });

### Read

    db.collection("myCollection", function (err, collection) {
        collection.findOne("myId", function (err, doc) {
            console.log(doc);
        });
    });

### Query

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

### Create

    doc = {
        name: "Ming"
    };
    db.collection("myCollection", function (err, collection) {
        collection.insert(doc, function (err, response) {
            console.log(response.id);
        });
    });

### Update

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

### Delete

    db.collection("myCollection", function (err, collection) {
        collection.remove("myId", function (err) {
            console.log("Deleted");
        });
    });

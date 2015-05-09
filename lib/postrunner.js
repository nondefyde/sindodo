/**
 * Created by Okafor on 27/04/2015.
 */

var prettyjson = require('prettyjson');
var qs = require('querystring');
var request = require('request');

var threeTapsClient = require('3taps')({apikey: 'b8309454f00d476b56be5a4054f254ed'});


var MongoClient = require('mongodb').MongoClient


var url = 'mongodb://localhost:27017/pingmefirst';
//// Use connect method to connect to the Server
//MongoClient.connect(url, function(err, db) {
//    assert.equal(null, err);
//    console.log("Connected correctly to server");
//
//    db.close();
//});


exports.reference = function () {
    var options = {
        auth_token: 'b8309454f00d476b56be5a4054f254ed',
    };


    //get all category group: http://reference.3taps.com/category_groups/
    //get all category: http://reference.3taps.com/categories/

    //get all location http://reference.3taps.com/locations/
    //option {level : [ country,state,metro,region,county,city,locality,zipcode ]}


    //look up location given location code: http://reference.3taps.com/locations/lookup/
    //options {code : [location code required here]}


    request({method: 'GET', uri: 'http://reference.3taps.com/categories/?' + qs.stringify(options)},
        function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var category_group = JSON.parse(body);
                console.log("Found: " + prettyjson.render(category_group, {noColor: false}));
            } else {
                console.log("Error: " + prettyjson.render(error, {noColor: false}));
            }
        }
    );

};

exports.search = function (anchor) {

    var options = {
        auth_token: 'b8309454f00d476b56be5a4054f254ed',
        category: 'VAUT',
        source: 'CRAIG',
        rpp:10,
        status: 'for_sale',
        retvals : "id,account_id,source,category,category_group,location,external_id," +
        "external_url,heading,body,timestamp,timestamp_deleted,expires,language," +
        "price,currency,images,annotations,status,state,immortal,deleted,flagged_status",
        annotations: "make:Ford AND source_state:Michigan AND paint_color:grey AND year:2009",
        "headings":"ford dually 1996",
        "location.country": 'USA'
    };

    //var annotations = "{make:Ford AND source_state:Texas AND paint_color:white AND year:1996}";

    var Url = 'http://search.3taps.com/?' + qs.stringify(options);
    console.log("Url: " + Url);




    //threeTapsClient.search(options, function (err, data) {
    //    if(!err){
    //        console.log("Values: " + prettyjson.render(data, {noColor: false}));
    //    }
    //});

    request({method: 'GET', uri: 'http://search.3taps.com/?' + qs.stringify(options)},
        function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var posts = JSON.parse(body);
                console.log("Found: " + prettyjson.render(posts, {noColor: false}));
                console.log('RESULT : ' + posts.postings.length);
                if (posts.postings.length > 0) {
                    MongoClient.connect(url, function (err, db) {
                        console.log("Connected correctly to server");

                        var collection = db.collection('postings');

                        collection.insert(posts, function (err, result) {
                            if(!err){
                                console.log("Inserted " + result.result.n + " documents into the document collection");
                                db.close();
                            }else{
                                console.log("Error: " + prettyjson.render(err, {noColor: false}));
                                db.close();
                            }

                        });

                    });
                }
                //
                //
                //res.send(results);
                //console.log(prettyjson.render(results, {noColor: false})); // Show the HTML for the Google homepage.
            } else {
                console.log("Error: " + prettyjson.render(error, {noColor: false}));
            }
        }
    );

};


exports.getAnchor = function(timestamp){
    threeTapsClient.anchor({
        timestamp : timestamp
    }, function (err, data) {
        if(!err){
            console.log("Anchor: " + prettyjson.render(data, {noColor: false}));
        }
    });
};

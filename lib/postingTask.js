/**
 * Created by Okafor on 24/04/2015.
 */

var prettyjson = require('prettyjson');
var request = require('request');
var qs = require('querystring');
global.Step = require('../lib/step');

var mongo = require('mongodb');
var db = new mongo.Db('pingmefirst', new mongo.Server('localhost',27017, {}), {});


var threeTapsClient = require('3taps')({ apikey : 'b8309454f00d476b56be5a4054f254ed' });






exports.retrievePost =  function(options){

    threeTapsClient.poll( options , function (error, data) {
        if(!error){
            var allposting = data.postings;
            console.log(allposting.length);
            console.log("value: " + prettyjson.render(allposting[0], {noColor: false}));

            var i = 0;
            for (; i < allposting.length; i++) {
                col.insert(allposting[i]);
            }

            var new_anchor = {
                success : true,
                anchor : '1429702518'
            };

            db.insert('anchor');

            console.log("Connection closing now: ");
            db.close(this);

        }else{
            console.log("Error: " + prettyjson.render(error, {noColor: false}));
        }
    });
}













var nextPost = function(db,anchor){

    //'2060494668'
    Step(
        function openDb() {
            db.open(this);
        },
        function createCollection(err, client) {
            client.createCollection("postings", this);
        },
        function posting(err, col) {

            col.remove({});
            console.log("Document removed");

            var option = {
                category: 'VAUT',
                source : 'CRAIG',
                timeout:20000,
                'location.country': 'USA',
                anchor: anchor
            };

            threeTapsClient.poll( option , function (error, data) {
                if(!error){
                    var allposting = data.postings;
                    console.log(allposting.length);
                    console.log("value: " + prettyjson.render(allposting[0], {noColor: false}));

                    var i = 0;
                    for (; i < allposting.length; i++) {
                        col.insert(allposting[i]);
                    }

                    var new_anchor = {
                        success : true,
                        anchor : '1429702518'
                    };

                    db.insert('anchor');



                    console.log("Connection closing now: ");
                    db.close(this);

                }else{
                    console.log("Error: " + prettyjson.render(error, {noColor: false}));
                }
            });
        }
    );

};


exports.search =  function(db){

}


var getAnchor = function(db, timestamp){
    Step(
        function openDb() {
            db.open(this);
        },
        function createCollection(err, client) {
            client.createCollection("anchors", this);
        },
        function anchor(err, anchor) {
            if(!err){
                threeTapsClient.anchor({
                    timestamp : timestamp
                }, function (err, data) {
                    if(!err){
                        anchor.insert(data);

                        console.log("Connection closing: ");
                        db.close(this);
                    }
                });

            }else{
                console.log("Error: " + prettyjson.render(error, {noColor: false}));
            }
        }
    );
};


var SearchForMartch = function(anchor){

    //var option = {
    //    category: 'VAUT',
    //    source : 'CRAIG',
    //    'body' : '2015 VENTURE RV SPORT TREK 270 VBH',
    //    //rpp: 50,
    //    //page: 5,
    //    'location.country': 'USA'
    //};

    var options = {
        "rejectUnauthorized": false,
        body : 'fixie',
        'location.city' : 'USA-SFO-SNF'
    }


    threeTapsClient.search( options, function (err, data) {
        if(!err){
            console.log("Found: " + prettyjson.render(data, {noColor: false}));
        }else{
            console.log("Error: " + prettyjson.render(err, {noColor: false}));
        }
    });
}



exports.search = function (req, res) {

    var option = {
        auth_token: 'b8309454f00d476b56be5a4054f254ed',
        source: 'CRAIG',
        external_id : "4990549585",
        category: 'VAUT',
        external_url : "http://tampa.craigslist.org/pnl/rvd/4990549585.html",
        rpp: 50
        //page: 50,
        //'location.country': 'USA',
        //anchor: '2060494668'
    };

    request({method: 'GET', uri: 'http://search.3taps.com/?' + qs.stringify(option)},
        function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var results = JSON.parse(body);
                console.log("Found: " + prettyjson.render(results, {noColor: false}));
                console.log('RESULT : ' + results.postings.length);
                //
                //
                //res.send(results);
                //console.log(prettyjson.render(results, {noColor: false})); // Show the HTML for the Google homepage.
            } else {
                console.log(error);
            }
        }
    );
};

exports.nextPost = nextPost;
exports.getAnchor = getAnchor;
exports.SearchForMartch = SearchForMartch;





'use strict';

/**
 * Module dependencies.
 */

var prettyjson = require('prettyjson');
var qs = require('querystring');
var request = require('request');
var _ = require('lodash');



exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};


var requestPostings = function(options, res){

    var main_options = {
        auth_token: 'b8309454f00d476b56be5a4054f254ed',
        category: 'VAUT',
        source: 'CRAIG',
        rpp:10,
        retvals : 'id,account_id,source,category,category_group,location,external_id,' +
        'external_url,heading,body,timestamp,timestamp_deleted,expires,language,' +
        'price,currency,images,annotations,status,state,immortal,deleted,flagged_status',
        'location.country': 'USA'
    };

    main_options = _.extend(main_options, options);
    console.log('main_options: ' + prettyjson.render(main_options, {noColor: false}));


    var Url = 'http://search.3taps.com/?' + qs.stringify(main_options);
    request({method: 'GET', uri: 'http://search.3taps.com/?' + qs.stringify(main_options)},
        function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var posts = JSON.parse(body);
                //console.log('Found: ' + prettyjson.render(posts, {noColor: false}));
                console.log('RESULT : ' + posts.postings.length);
                if (posts.postings.length > 0) {
                    res.json(posts);
                }
                console.log('URL : ' + Url);
            } else {
                console.log('Error: ' + prettyjson.render(error, {noColor: false}));
            }
        }
    );
};



exports.search = function(req, res) {


    console.log('search main_options: ' + prettyjson.render(req.query, {noColor: false}));

    var search_query = req.query.search_query;
    var options = {
        'body': search_query
    };



    requestPostings(options, res);
};


exports.nextsearch = function(req, res) {

    console.log('search main_options: ' + prettyjson.render(req.query, {noColor: false}));

    var search_query = req.query.search_query;
    var page = req.query.page;


    var options = {
        page: page,
        'body': search_query
    };

    console.log('next earch main_options: ' + prettyjson.render(options, {noColor: false}));

    requestPostings(options, res);

};



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


var requestPostings = function(options, res,req){

    var search_query = req.query.search_query;

    var status = req.query.search_query;
    var year = '1996';
    var make = 'Ford';
    var model = req.query.model;
    var state = 'Texas';
    var color = 'white';

    var annot = '{make:'+make+' OR source_state:'+state+' OR paint_color:'+color+' OR year:'+year+'}';

    var main_options = {
        auth_token: 'b8309454f00d476b56be5a4054f254ed',
        category: 'VAUT',
        source: 'CRAIG',
        rpp:10,
        retvals : 'id,account_id,source,category,category_group,location,external_id,' +
        'external_url,heading,body,timestamp,timestamp_deleted,expires,language,' +
        'price,currency,images,annotations,status,state,immortal,deleted,flagged_status',
        'location.country': 'USA',
        annotations : annot,
        heading: search_query
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
    var options = {};
    requestPostings(options, res,req);
};


exports.nextsearch = function(req, res) {
    console.log('next search main_options: ' + prettyjson.render(req.query, {noColor: false}));
    var page = req.query.page;
    var options = {
        page: page
    };
    requestPostings(options, res,req);
};

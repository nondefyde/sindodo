'use strict';

/**
 * Module dependencies.
 */

var prettyjson = require('prettyjson');
var qs = require('querystring');
var request = require('request');
var truncate = require('truncate');


exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};


exports.search = function(req, res) {

    var search_query = req.params.search_query;

    var options = {
        auth_token: 'b8309454f00d476b56be5a4054f254ed',
        category: 'VAUT',
        source: 'CRAIG',
        rpp:10,
        status: 'for_sale',
        retvals : 'id,account_id,source,category,category_group,location,external_id,' +
        'external_url,heading,body,timestamp,timestamp_deleted,expires,language,' +
        'price,currency,images,annotations,status,state,immortal,deleted,flagged_status',
        annotations: 'make:Ford AND source_state:Michigan AND paint_color:grey AND year:2009',
        'headings':search_query,
        'body': search_query,
        'location.country': 'USA'
    };

    var Url = 'http://search.3taps.com/?' + qs.stringify(options);

    request({method: 'GET', uri: 'http://search.3taps.com/?' + qs.stringify(options)},
        function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var posts = JSON.parse(body);
                console.log('Found: ' + prettyjson.render(posts, {noColor: false}));
                console.log('RESULT : ' + posts.postings.length);
                if (posts.postings.length > 0) {
                    res.json(posts);
                }

            } else {
                console.log('Error: ' + prettyjson.render(error, {noColor: false}));
            }
        }
    );
};

/**
 * Created by Sarah Ahmed on 5/6/2015.
 */

var async = require('async');
var express = require('express');
var funcs = require('./funcs');
var cheerio = require('cheerio');
var fs = require('fs');
var requestMod = require('request');

var app = express();

var extractQuery = funcs.extractQuery;
var filterAndFormat = funcs.filterAndFormat;

app.get('/I/want/title', function(request, response) {
    var addresses = extractQuery(request);
    var addressObjList = filterAndFormat(addresses);

    sendRequest = function(addressObjList2) {
        var titles = [];
        console.log("length = inside " +addressObjList2.length)
        var htmlBasic = "<html><head><body><h1>Here is the list of titles you requested:</h1><ul></ul></body></head></html>"
        var j = 0;
        var htmlAdv = null;
        var listItem = "";

        async.waterfall([
                function(callback) {
                    fs.writeFile('Views/titlesJ.jade', 'include titlesMy.html', 'utf-8', function(err55) {
                        return callback(err55);
                    })
                },
                function(callback) {
                    fs.writeFile('Views/titlesMy.html', htmlBasic, 'utf-8', function (err81) {
                        return callback(err81);
                    });
                },
                function(callback) {
                    async.each(addressObjList2,
                        function(item, doneCallback ) {
                            console.log("Inside async 2nd arg")
                            requestMod({url: item.href, followRedirect: true}, function(err222, response2, body) {
                                console.log('Inside requestMod')
                                if (!err222 & response2 != null ) {
                                    console.log("no error in request mod")
                                    var $ = cheerio.load(body);
                                    var title = $('title').text();
                                    if ( title == '') {
                                        title = "no title from " + response2.connection._host;
                                    }
                                    titles.push(title);
                                    console.log(titles);
                                    listItem = listItem + "<li>" + title + "</li>";
                                } else {
                                    console.log(err222)
                                    if (response2 == null) {
                                        console.log('response is null')
                                    }
                                }
                                console.log("done callback")
                                return doneCallback();
                            })
                        },
                        function(err) {
                            if ( err ) {
                                console.log("Some err in async");
                                return;
                            } else {
                                console.log("No error in async done func")
                                var $ = cheerio.load(htmlBasic);
                                $('ul').append(listItem);
                                htmlAdv = $.html();
                                fs.writeFile('Views/titlesMy.html', htmlAdv, 'utf-8', function(err909) {
                                    if (err909) {
                                        console.log("There's an error 909 at " + j + " : " + err909);
                                        response.send("Error in the file to be rendered, sorry")
                                        return callback(err909);
                                    } else {
                                        console.log(j)
                                        response.render('titlesJ.jade');
                                        response.send();
                                        return callback();
                                    }
                                } )
                            }
                        }
                    )}],
                function(err987, result) {
                    if (!err987) {
                        console.log('job well done waterfall');
                    }
                    else {
                        console.log("something went wrong in waterfall")
                        console.log(err987)
                    }
                    return;
                }
        );
    }

    if ( addressObjList.length > 0 ) {
        sendRequest(addressObjList)
    } else {
        response.send('nothing to show');
    }
    return;
});

app.get('*', function(request, response) {
    response.send('any path')
    return;
})
app.listen(4312);

console.log("listening on port 4312")



doneCallback = function(){
    console.log("inside done callback");
}

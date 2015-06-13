/**
 * Created by Sarah Ahmed on 5/3/2015.
 */

var express = require('express');
var requestMod = require('request');
var cheerio = require('cheerio');
var jade = require('jade');
var fs = require('fs')
var app = express();

var funcs = require('./funcs.js');
var filterAndFormat = funcs.filterAndFormat;
var extractQuery = funcs.extractQuery;

app.get('/I/want/title', function(request, response) {
    var addresses = extractQuery(request);
    var addressObjList = filterAndFormat(addresses);

    sendRequest = function (addressObjList2) {
        var titles = [];
        console.log("length = inside " +addressObjList2.length)
        var htmlBasic = "<html><head><body><h1>Here is the list of titles you requested:</h1><ul></ul></body></head></html>"
        fs.writeFile('Views/titlesMy.html', htmlBasic, 'utf-8', function (err81) {
            if (err81) {
                console.log("There's an error err81 : " + err81);
                return;
            } else {
                var j = 0;
                var htmlAdv = null;
                var listItem = "";
                for (var i = 0; i < addressObjList2.length; i++) {
                    requestMod({url: addressObjList2[i].href, followRedirect: true}, function (err, response2, body) {
                        j++;
                        if (!err && response2 != null) {
                            var $ = cheerio.load(body);
                            var title = $('title').text();
                            if ( title == '') {
                                title = "no title from " + response2.connection._host;
                            }
                            titles.push(title);
                            listItem = listItem + "<li>" + title + "</li>";
                        } else {
                            console.log(err)
                            if (response2 == null) {
                                console.log('response is null')
                            }
                        }

                        if ( j == addressObjList2.length) {
                            var $ = cheerio.load(htmlBasic);
                            $('ul').append(listItem);
                            htmlAdv = $.html();
                            fs.writeFile('Views/titlesMy.html', htmlAdv, 'utf-8', function(err909) {
                                if (err909) {
                                    console.log("There's an error 909 at " + j + " : " + err909);
                                    response.end("Error in the file to be rendered, sorry")
                                    return;
                                } else {
                                    console.log(j)
                                    fs.writeFile('Views/titlesJ.jade','include titlesMy.html', 'utf-8', function(err463) {
                                        if (!err463) {
                                            response.render('titlesJ.jade');
                                            response.end();
                                        }
                                        else {
                                            response.end("error in jade file I/O")
                                        }
                                    })
                                    return;
                                }

                            } )
                        }

                        console.log("titles: ")
                        console.log(titles);
                        return;
                    })
                }
                return;
            }
        })

    }


    if ( addressObjList.length > 0) {
        sendRequest(addressObjList);
    } else {
        response.end("Nothing to show");
    }


})

app.get('*', function(request, response) {
    response.end("any path");
})

app.listen(2224);

console.log("listening on port 2224");

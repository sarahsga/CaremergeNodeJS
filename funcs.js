/**
 * Created by Sarah Ahmed on 5/6/2015.
 */

url = require('url');
urlRegex = require('url-regex');
querystring = require('querystring');

module.exports = {

    extractQuery : function (request) {
        query = url.parse(request.url).query;

        var addresses = [];
        if (query != null) {
            queryObj = querystring.parse(query);
            addresses = queryObj.address;

            if( typeof(addresses) == 'string') { // for a query with just one key/value pair, when assigned to addresses, treats it as a string instead of an array
                // so, addresses.length becomes > 1 cz it considers addresses a string.
                addresses = [];
                addresses.push(queryObj.address)
            }
        }
        return addresses;
    },


    filterAndFormat : function (addresses) {
        var validAddresses = [];
        for ( var i = 0 ; i < addresses.length ; i++ ) { // checking for the validity of each address
            if(urlRegex().test(addresses[i]) == true) {
                validAddresses.push(addresses[i]);
            }
        }

        var addressObjList = [];
        for ( var i = 0 ; i < validAddresses.length ; i++ ) {// formatting each valid address
            addressObjList.push(url.parse(validAddresses[i]));
            if ( addressObjList[i].host == null) { // if the valid address is not already formatted
                addressObjList[i] = url.parse("http://" + validAddresses[i]);
            }
        }
        return addressObjList;
    }

}


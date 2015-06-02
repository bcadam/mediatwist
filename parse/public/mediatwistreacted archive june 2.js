// this is version 1.0 of the mediatwist library
// all rights are reserved

//  uglifyjs "mediatwistreacted human.js" -m -c -e -o mediatwistreacted.js


/// load in the two libraries necessary for this to work
loadScript("https://cdn.jsdelivr.net/parse/1.2.9/parse.min.js", function() {

    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".sneaky { opacity: 0 }";
    document.body.appendChild(css);


    //loadScript("https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js", function(){});
    /// create the parse connection to get the info about the site
    Parse.initialize("eDMdMhqERrdc0eN16XJ5mZ5Iq0iTmk4URQrNJVaX", "Ap331XrGb0AyMT4FzysCJXWoTkkXXvTLNQYDPBsh");


    var referrer = document.referrer;

    var lookingForArray;

    // look for the clues in the url. This will only match imags whose tags match perfectly
    if (referrer) {
        lookingForArray = processURL(referrer);
        //alert(referrer);
    } else {
        lookingForArray = processURL(window.location.href);
        //alert(lookingForArray);
    }

    //get all the images in the document included multipe data points
    var imagesonCurrentPage = document.images;

    // for (var i = 0; i < imagesonCurrentPage.length; i++)
    // {
    //     //imagesonCurrentPage[i].className = imagesonCurrentPage[i].className + " sneaky";

    //     imagesonCurrentPage[i].classList.add("sneaky");
    // }

    //alert(imagesonCurrentPage);
    //var test = document.images.length;
    //all of the assets that have been associated with the site
    var arraySiteAssets = new Array();

    var matchingSite = new Object();
    var matchingBassets = new Object();
    var matchedBassets = [];
    //var matchingTargets = new Object();

    var TempSite = Parse.Object.extend("Site");
    var TempTarget = Parse.Object.extend("Target");
    var TempBassets = Parse.Object.extend("Basset");

    var querySite = new Parse.Query(TempSite);
    var queryTargets = new Parse.Query(TempTarget);
    var queryBassets = new Parse.Query(TempBassets);

    //querySite.limit(1);
    //queryTargets.limit(50);
    //queryBassets.limit(50);

    var windowurl = window.location.protocol + "//" + window.location.host + '/';

    //windowurl = "placeHolderForTesting.com";
    //alert(windowurl);

    querySite.equalTo("url", windowurl);
    querySite.equalTo("published", true);
    querySite.include("owner");

    querySite.find(function(results) {

        matchingSite = results[0];
        arraySiteAssets = matchingSite.get("siteassets");
        //console.log(matchingSite.id);

    }).then(function() {
        

        queryBassets.equalTo("site", matchingSite);
        queryBassets.equalTo("published", true);
        
        queryBassets.find(function(results) {
            matchingBassets = results;
            //console.log(matchingBassets);
            //remove unmatched bassets based on refferring info
            for (var i = 0, counter = matchingBassets.length; i < counter; i++) {
                
                //console.log(matchingBassets[i].attributes.tags);
                var holder = matchingBassets[i].get("tags");

                //console.log(holder);
                //console.log(matchingBassets[i].attributes.tags);
                //alert(lookingForArray);
                if ( intersect(holder, lookingForArray).length >= 1 ) {
                    
                    matchedBassets.push(matchingBassets[i]);

                }

            }

            matchedBassets.sort(function() {
              return .5 - Math.random();
            });

            /** should check to see if any of the tags matches before subing in the new ones**/
        })
        .then(function(){


            queryTargets.equalTo("site", matchingSite);
            queryTargets.equalTo("published", true);
            queryTargets.find(function(results) {
                console.log("Matching Site: " + matchingSite.id);
                console.log("Matching Targets: " + results.length);
                console.log("Matched Assets: " + matchedBassets.length);
                //console.log(matchedBassets)
                matchingTargets = results;

                //alert(matchingTargets);
                // go through every image on the current page and check if it is a target
                // if it is then replace the target with a Basset
                for (var i = 0, iLen = imagesonCurrentPage.length; i < iLen; i++) {

                    //alert(matchingTargets.length);
                    for (var x = 0, xLen = matchingTargets.length; x < xLen; x++) {
                        //alert(matchingTargets[x].get("url"));
                        //alert(imagesonCurrentPage[i].src);
                        //console.log(matchingTargets[x].get("url"));
                        //console.log(imagesonCurrentPage[i].src);

                        if (matchingTargets[x].get("url") == imagesonCurrentPage[i].src) {
                            //console.log(imagesonCurrentPage[i]);
                            //console.log(matchedBassets[i].attributes.image._url);
                            //var matchedPic = matchedBassets[i].get("image");
                            //console.log( matchingTargets[x].get("height") );
                            imagesonCurrentPage[i].src = matchedBassets[i].attributes.image._url;
                            //console.log("that's " + matchedPic.url() );
                            //console.log("it is " + imagesonCurrentPage[i].height);
                            var holderHeight = imagesonCurrentPage[i].height - 1;
                            var holderWidth = imagesonCurrentPage[i].width - 1;
                            imagesonCurrentPage[i].style.height = holderHeight + "px";
                            imagesonCurrentPage[i].style.width = holderWidth + "px";
                            var SwitchedAsset = Parse.Object.extend("Switch");
                            var switchedasset = new SwitchedAsset();
                            switchedasset.set("site", matchingSite);
                            switchedasset.set("target", matchingTargets[x] );
                            switchedasset.set("basset", matchedBassets[i] );
                            switchedasset.set("needle", lookingForArray );
                            switchedasset.set("owner", matchingSite.get("owner") );
                            switchedasset.save();

                        }

                    }



                    }


            });


        });

    });

    //end of load function method that calls parse
});



function processURL(variable) {
    variable = variable.replace(window.location.protocol + "//" + window.location.host, "")
    
    variable = variable.replace("/index.html",null);
    //console.log(variable);
    variable = variable.replace(/&q=/g, ",");
    variable = variable.replace(/&oq/g, ",");
    variable = variable.replace(/=/g, ",");
    variable = variable.replace("#", ",");
    variable = variable.replace(/\+/g, ",");
    variable = variable.replace(/&/g, ",");
    variable = variable.replace(/\?/g, ",");

    variable = variable.split(",");
    variable.remove(null);
    //variable.shift();
    //alert(variable);
    return variable;
}




//alert(intersect(["cat","phone","fire","adam","cat"], ["fire","cat"]));

function intersect(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function(e) {
        if (b.indexOf(e) !== -1) return true;
    });
}

//function to load in the necessary libraries
function loadScript(url, callback) {

    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState) { //IE
        script.onreadystatechange = function() {
            if (script.readyState == "loaded" ||
                script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { //Others
        script.onload = function() {
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

/** Array Remove - By John Resig (MIT Licensed)
    removes the stated entry in an array
    note this shifts the others forward obvs **/

Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};



// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});


Parse.Cloud.define('getSite', function(request, response) {
  
  var targetUrl = request.params.siteUrl;

  Parse.Cloud.httpRequest({

    url: targetUrl,
    success: function(httpResponse) {
        response.success(httpResponse);
    },
    error: function(httpResponse) {
        var failer = new Array();
        failer[0] = "fail";
        failer[1] = httpResponse.status;
        response.success(failer);
    }
});

});




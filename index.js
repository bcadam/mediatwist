var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/public/home.html');
});

app.get('/mediatwist.js', function(request, response) {
  response.sendFile(__dirname + '/public/parse/public/mediatwistreacted.js');
});

app.use(express.static(__dirname + '/public'));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



var express = require('express');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/exposed/home.html');
});

app.get('/mediatwist.js', function(request, response) {
  response.sendFile(__dirname + '/public/mediatwistreacted.js');
});

app.use(express.static(__dirname + '/exposed'));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

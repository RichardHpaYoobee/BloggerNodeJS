var express = require('express');
var cors = require('cors');
var config = require('./config');
var path = require('path');
var app = express();
var request = require('request');
var rp = require('request-promise');

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var blogger = google.blogger('v3');

var tokens;

app.use(cors());

app.use(function(request, response, next){
	console.log(`${request.method} request for ${request.url}`);
	next();
});

app.get('/createGoogleBloggerPost/title=:title/content=:content', blogPost);
app.get("/sendPost", blogCallBack);


function getOAuthClient() {
    return new OAuth2(config.ClientID, config.ClientSecret, 'http://localhost:3000/sendPost');
}

function getAuthUrl() {
    var oauth2Client = getOAuthClient();
    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/blogger'
    });
    return url;
}
function blogPost(req, res, next){
 	var params = {
        auth: getAuthUrl()
    };
    res.json(params.auth);
}


function blogCallBack(req, res) {
	console.log(decodeURIComponent(req.query.state));
	var params = JSON.parse(req.query.state)

    var oauth2Client = getOAuthClient();
    var code = req.query.code;
    oauth2Client.getToken(code, function (err, tokens) {

        if (!err) {
            oauth2Client.setCredentials(tokens);
            // var params = {
            //     title: 'Sample title',
            //     content: 'Sample Content'
            // };
            var options = {
                uri: 'https://www.googleapis.com/blogger/v3/blogs/1251278663663343818/posts/',
                method: 'POST',
                body: params,
                headers: {
                    'User-Agent': 'Request-Promise',
                    "Authorization": 'Bearer ' + tokens.access_token
                },
                json: true
            };
            rp(options)
            .then(function (response) {
                if (res.statusCode >= 100 && res.statusCode < 600)
                    return res.redirect('/');
                else
                    return res.status(500);
            })
            .catch(function (err) {
                return res.status(res.statusCode).send(err);
            });

        } else {
            console.log('Error Getting BloggerAPI Token', err);
        }
    });
}

app.use(express.static("./public"));
app.use('/scripts', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

app.use('/config', express.static(path.join(__dirname)));

app.listen(3000);

console.log("Server running on port 3000");
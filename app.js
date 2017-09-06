var express = require('express');
var cors = require('cors');
var config = require('./config');
var path = require('path');
var app = express();
var bodyParser = require("body-parser");
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var blogger = google.blogger('v3');

var tokens;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


app.use(function(request, response, next){
	console.log(`${request.method} request for ${request.url}`);
	next();
});


app.post('/createGoogleBloggerPost', blogPost);
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

var body;
function blogPost(req, res, next){
    body = req.body;
 	var params = {
        auth: getAuthUrl()
    };
    res.json(params.auth);
}


function blogCallBack(req, res) { 
    var oauth2Client = getOAuthClient();
    var code = req.query.code;
    oauth2Client.getToken(code, function (err, tokens) {

        if (!err) {
            oauth2Client.setCredentials(tokens);
            blogger.posts.insert({
                auth: oauth2Client,
                blogId: '1251278663663343818',
                resource: {
                  title: body['title'],
                  content: body['content']
                }
            }, function(){
                return res.redirect('/');
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
const express = require('express');
const session = require('express-session')
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser')

var app = express();

//configure body parser
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

//configure Body Parser
app.use(bodyParser.urlencoded({extended: false}));

//configure public to be statically served
app.use(express.static('public'));

app.use(session({
  secret: '2C44-4D44-WppQ38S',
  resave: false,
  saveUninitialized: true
}));


let userinfo = {
  'username': 'rudy',
  'password': 'rudyspassword'
}

let auth = function(req, res, next){
  if(req.session && req.session.admin){
    return next();
  } else {
    return res.sendStatus(401);
  }
}

//Redirect to either restricted content or login page, depending on login
app.get('/', function(req, res){
  if(req.session && req.session.admin) {
    res.redirect('/content');
  } else {
    res.redirect('/login');
  }
});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', function(req, res){
 if (req.body.username === userinfo.username &&
 req.body.password === userinfo.password) {
   req.session.admin = true;
   res.redirect('/');
 }
});

app.get('/content', auth, function(req, res) {
  res.render('content');
});

app.post('/logout', function(req, res) {
  req.session.destroy();
  res.render('logout');
});

app.listen(3000, function(){
  console.log('Server Started');
});

module.exports=function(){
	var stime=new Date().getTime();
	var express = require('express');
	var app = express();
	var bodyParser = require('body-parser');
	var session = require('express-session');
	var low=require('lowdb');
	var e=require('./encrypt');
	
	var db=low('./db/user.json');
	app.use(bodyParser.json());
	app.use(session({
		secret: rstring(128),
		name: 'tmp',
		resave: true,
		saveUninitialized: true,
		cookie: { maxAge: 60 * 1000 }
	}));
	app.use(bodyParser.urlencoded({
	  extended: true
	})); 
	app.use('/html',express.static('./html'));
	app.get('/',function(req,res){
		res.send((new Date().getTime()-stime).toString());
	});
	app.get('/profile',function(req,res){
		if(req.session.logined){
			res.send('Welecome '+e.decrypt(req.session.identity)+'!');
		}
		else
			res.redirect('../');
	});
	app.post('/login',function(req,res){
		if(e.decrypt(db.get(req.body.ac).value())==req.body.pw){
			req.session=true;
			res.redirect('./profile');
		}
		else
			res.send('login failed');
	});
	app.post('/register',function(req,res){
		if(!db.get(req.body.ac).value()){
			db.set(req.body.ac,e.encrypt(req.body.pw)).value();
			res.send('Register Successful');
		}
		else
			res.send('Account has registered!');
	});
	app.listen(80, function () {
	  console.log('server started');
	});
	function rstring(l){
		var text = "";
		var cset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for( var i=0; i < l; i++ )
			text += cset.charAt(Math.floor(Math.random() * cset.length));
		return text;
	}
}
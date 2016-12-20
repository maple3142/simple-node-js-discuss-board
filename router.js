module.exports=function(){
	var path=require('path');
	var express = require('express');
	var app = express();
	var bodyParser = require('body-parser');
	var session = require('express-session');
	var low=require('lowdb');
	var db=low('./db/board.json');

	app.engine('ejs', require('ejs').renderFile);
	app.set('view engine', 'ejs');
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(bodyParser.json());
	app.use(session({
		name: 'tmp',
		secret: 'EE5SwYstbe0ZIv5Zw5kZT6QWsPMEnQ3w0cT7nJK0wCsBriArb06YyTqqnlGu7h27tKN7VjiWiESa6ksLATsdeWUj7xMAzqDmlA7sU4e8tVOO41pgCaPYckJrKT8i5DL4',
		cookie: { maxAge: 60 * 1000 },
		resave: true,
		saveUninitialized: true
	}));

	app.get('/',(req,res)=>{
		res.render('./board',{msg: db.get('msg').value(),admin :req.session.admin});
	});
	app.post('/addmsg',(req,res)=>{
		db.get('msg').push({text: req.body.msg, id: Date.now()}).value();
		res.redirect('../');
	});
	app.get('/delete',(req,res)=>{
		var msgs=db.get('msg').value();
		for(i in msgs){
			if(msgs[i].id==req.query.id){
					db.get('msg').remove(msgs[i]).value();
					break;
			}
		}
		res.redirect('../');
		
	});
	app.post('/login',(req,res)=>{
		if(req.body.pw=='Kirby123'){
			req.session.admin=true;
		}
		res.redirect('../');
	});
	app.get('/logout',(req,res)=>{
		req.session.admin=false;
		res.redirect('../');
	});

	//listen
	app.listen(80,function(){
	  console.log('server started');
	});
}
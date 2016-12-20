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
	app.get('/',function(req,res){
		res.render('./board',{msg: db.get('msg').value()});
	});
	app.post('/addmsg',function(req,res){
		db.get('msg').push({text: req.body.msg, id: Date.now()}).value();
		res.redirect('../');
	});
	app.get('/delete',function(req,res){
		console.log(req.query.id);
		console.log(db.get('msg').find({id: req.query.id}));
		db.get('msg').filter({id: req.query.id}).remove().value();
		res.redirect('../');
	});
	//listen
	app.listen(80,function(){
	  console.log('server started');
	});

	var alert=function(s){
		res.send('<script>alert("'+s+'");</script>');
	}
}
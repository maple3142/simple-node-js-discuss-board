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
		console.log(req.body);
		db.get('msg').push(req.body.msg).value();
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
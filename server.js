var path = require("path");
var express = require("express");
var app = express();
var mongoose = require('mongoose');
var moment = require("moment");
var bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "/static")));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');


var server = app.listen(8000, function() {
 console.log("listening on port 8000");
})


mongoose.connect('mongodb://localhost/dashboard');
var DashboardSchema = new mongoose.Schema({
	brand: String,
	type: String,
	height: Number,
	price: Number
})

var Heel = mongoose.model('Dashboard', DashboardSchema);

app.get('/', function (req,res){
	Heel.find({},function(err,shoes){
		if(err){
			console.log("nope");
		}else{
			console.log(shoes);
			res.render('index', {data:shoes});
		}
	})
})

app.get('/shoes/new', function (req, res) {
   		res.render('add');
})

app.post('/shoes', function (req,res){
	console.log("POST DATA", req.body);

	var shoe = new Heel({brand: req.body.brand, type: req.body.type, height: req.body.height, price: req.body.price});

	shoe.save(function(err){
		if(err){
			console.log("something failed");
		}else{
			console.log('shoe was added!');
			res.redirect('/');
		}
	})
})
app.get('/shoes/:id/edit', function(req,res){
	Heel.find({_id : req.params.id},function (err,shoe){
		if(err){
			console.log('not happening');
		}else{
			console.log(shoe);
			res.render('edit',{data:shoe});
		}
	})
})
app.post('/shoes/:id', function(req,res){
	console.log("POST DATA", req.body);
	Heel.update(req.params.id, {$set: {brand: req.body.brand, type: req.body.type, height: req.body.height, price: req.body.price}},function (err,shoe){
		if(err){
			console.log('definitely not');
		}else{
			console.log('yaaaaaaas');
			res.redirect('/');
		}
	});
})
app.get('/shoes/:id', function(req, res) {
   		console.log("POST DATA", req.body);
   		Heel.find({_id : req.params.id},function (err,shoe){
		if(err){
			console.log('nuh uh');
		}else{
			console.log(shoe);
			res.render('show',{data:shoe});
		}
	})
})
app.get('/shoes/:id/destroy', function(req,res){
	Heel.remove({_id: req.params.id}, function (err, shoe){
    	res.redirect('/');
	})
})

var express = require('express'),
	bodyParser = require('body-parser'),
	mongojs = require('mongojs'),
	db = mongojs('catalog', ['products']);

var app = express();

app.use(bodyParser.json());

app.get('/', function(req, res, next){
	res.send("please use api/products");
});

app.get('/api/products', function(req, res, next){
	// res.send("list products");
	db.products.find(function(err, docs){
		if(err){
			res.send(err);
		}
		console.log('Products found');
		res.json(docs);
	});
});

app.get('/api/products/:id', function(req, res, next){
	// res.send('list  product ' + req.params.id);
	db.products.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, doc){
		if(err){
			res.send(err);
		}
		console.log('Products found');
		res.json(doc);
	});
});

app.post('/api/products', function(req,res,next){
	// res.send('Add product');
	db.products.insert(req.body, function(err,doc){
		if(err){
			res.send(err);
		}
		console.log('adding product');
		res.json(doc);
	});
});

app.put('/api/products/:id', (req,res,next) => {
	
	db.products.findAndModify({query: {_id: mongojs.ObjectId(req.params.id)}, 
		update: {
		$set: {
			name: req.body.name,
			category: req.body.category,
			price: req.body.price,
			image: req.body.image
		}},
		new: true }, (err, doc) => {
			if(err){
				res.send(err);
			}
			console.log('updating product');
			res.json(doc);
		})
});


app.delete('/api/products/:id', function(req,res,next){
	db.products.remove({_id: mongojs.ObjectId(req.params.id)}, (err, doc) => {
		if(err){
				res.send(err);
			}
			console.log('deleting product');
			res.json(doc);
		})
});

var port =  3000;

app.listen(port, function(){
	console.log("App is starting on port " + port);
});
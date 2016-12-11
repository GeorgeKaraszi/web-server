let express = require('express');
let bodyParser = require('body-parser');
let _ = require('underscore');
var db = require('./db.js');


let app = express();
let PORT = process.env.PORT || 3000;
let todos = [];
let todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

// GET /todos?completed=false&q=work
app.get('/todos', function(req, res) {
	let queryParams = req.query;
	let filteredTodos = todos;

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {
			completed: true,
		});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {
			completed: false,
		});
	}

	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		filteredTodos = _.filter(filteredTodos, function(todo) {
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	}

	res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
	db.todo.findById(req.params.id).then(function(todo){
		if(!!todo){
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}).catch(function(e){
		res.status(500).json(e);
	});
});

// POST /todos
app.post('/todos', function(req, res) {
	let body = _.pick(req.body, 'description', 'completed');

	db.todo.create(body).then(function(todo){
		console.log("HELP");
		res.json(todo.toJSON());
	}).catch(function(e){
		res.status(400).json(e);
	});
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	let todoId = parseInt(req.params.id, 10);
	let matchedTodo = _.findWhere(todos, {
		id: todoId,
	});

	if (!matchedTodo) {
		res.status(404).json({
			'error': 'no todo found with that id',
		});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
	let todoId = parseInt(req.params.id, 10);
	let matchedTodo = _.findWhere(todos, {
		id: todoId,
	});
	let body = _.pick(req.body, 'description', 'completed');
	let validAttributes = {};

	if (!matchedTodo) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);
});

db.sequalize.sync().then(function(){
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});

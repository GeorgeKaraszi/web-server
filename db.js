let Sequalize = require('sequelize');
let sequalize = new Sequalize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/data/dev-todo-api.sqlite',
});

var db = {};

db.todo = sequalize.import(__dirname + '/models/todo.js');
db.sequalize = sequalize;
db.Sequalize = Sequalize;

//Here some comment stuff
module.exports = db;
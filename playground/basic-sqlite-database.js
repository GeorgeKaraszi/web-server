let Sequalize = require('sequelize');
let sequalize = new Sequalize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/basic-sqlite-database.sqlite',
});

let Todo = sequalize.define('todo', {
    description: {
        type: Sequalize.STRING,
        allowNull: false,
        validate: {
            len: [1, 250],
        },
    },
    completed: {
        type: Sequalize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
});

sequalize.sync({
    // force: true
}).then(function() {
    console.log('Everything is synced');

    Todo.findById(3).then(function(todo){
        if(todo){
            console.log(todo);
        } else {
            console.log("Todo not found")
        }
    });

    // Todo.create({
    //     description: 'Takeout trash',
    //     // completed: false,
    // }).then(function(todo) {
    //     return Todo.create({
    //         description: 'Clean office'
    //     });
    // }).then(function(){
    //     // return Todo.findById(1)
    //     return Todo.findAll({
    //         where: {
    //             description:{
    //                 $like: '%trash%'
    //             }
    //         }
    //     })    
    // }).then(function(todos){
    //     if(todos){
    //         todos.forEach(function(todo){
    //             console.log(todo.toJSON());
    //         });
    //     } else {
    //         console.log("No todo found");
    //     }
    // }).catch(function(e){
    //     console.log(e);
    // });
});

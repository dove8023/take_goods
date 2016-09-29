// 链接
var Sequelize = require('sequelize');
var sequelize = new Sequelize('nodejs', 'root', '', {host : '127.0.0.1', port : '3306', dialect : 'mysql'});
// definition
var Task = sequelize.define('Task', {
    // auto increment, primaryKey, unique
    id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true},

    // comment
    title : {type : Sequelize.STRING, comment : 'Task title'},

    // allow null
    description : {type : Sequelize.TEXT, allowNull : true},

    // default value
    deadline : {type : Sequelize.DATE, defaultValue : Sequelize.NOW}
});
Task.sync().on('success', function(){
    console.log('aa..');
}).on('failure', function(){
    console.log('bb..');
});
// sequelize.query('your query', [, callee], [, options], [, replacements])
// Callee is the model definition. This allows you to easily map a query to a predefined model for sequelizejs
// Options is an object with the following keys:
// {
//  logging: console.log, a function (or false) for logging your queries
//  plain: false,  if plain is true, then sequelize will return all of the records within an array, otherwise it will return a single object/first record returned.
//  raw: false,    Set this to true if you don't have a model definition for your query
// }
// Replacements is a simple array that replaces all of the bindings within your query
sequelize.query('select * from user  where title = ? and description = ?', null, {logging : true, plain : true,  raw : true}, ['test_title_1', 'test_description_1']).success(function(res){
    console.log(res);
});
// find
Task.findAll({limit : 10, order : 'id asc'}, {raw : true, logging : true, plain : false}).on('success', function(res){
    console.log(res);
}).on('failure', function(err){
    console.log(err);
})
// count
Task.count({where : {title : 'test_title_1'}}, {logging : false}).on('success', function(i){
    console.log(i);
}).on('failure', function(err){
    console.log(err);
});
// max or min
Task.max('id').on('success', function(max){
    console.log(max);
}).on('failure', function(err){
    console.log(err);
});
// insert
Task.build({title : 'test_title_3', 'description' : 'test_description_3'}).save().on('success', function(msg){
    console.log(msg);
}).on('failure', function(err){
    console.log(err);
});

Task.create({title : 'test_title_4', 'description' : 'test_description_4'}).on('success', function(msg){
    console.log(msg);
}).on('failure', function(err){
    console.log(err);
});
// update
Task.update({description : 'test_description_2000'}, {id : '2'}).on('success', function(msg){
    console.log(msg);
}).on('failure', function(err){
    console.log(err);
});
// delete
Task.destroy({id : '4'}).on('success', function(msg){
    console.log(msg);
}).on('failure', function(err){
    console.log(err);
});
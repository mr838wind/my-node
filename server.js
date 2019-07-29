var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

  
  
// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: ' hello world !! ' })
});
// connection configurations
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'node_js_api'
});
  
// connect to database
dbConn.connect(); 
 
 
// Retrieve all users 
app.get('/users', function (req, res) {
    dbConn.query('SELECT * FROM users', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'users list.' });
    });
});
 
 
// Retrieve user with id 
app.get('/users/:id', function (req, res) {
  
    let user_id = req.params.id;
  
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
  
    dbConn.query('SELECT * FROM users where id=?', user_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'users info feteched.' });
    });
  
});
 
 
// Add a new user  
app.post('/users', function (req, res) {
  
    let user = req.body;

    console.log('>> adding users');
    console.log(user);
  
    if (!user) {
        return res.status(400).send({ error:true, message: 'Please provide user' });
    }
  
    dbConn.query("INSERT INTO users (name, email) values (?,?) ", [user.name, user.email], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'New user has been created successfully.' });
    });
});
 
 
//  Update user with id
app.put('/users/:id', function (req, res) {
  
    let user_id = req.params.id;
    let user = req.body;

    console.log('>> update users');
    console.log(user_id);
  
    if (!user_id || !user) {
        return res.status(400).send({ error: user, message: 'Please provide user and user_id' });
    }
  
    dbConn.query("UPDATE users SET name=?,email=? WHERE id = ?", [user.name, user.email, user_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'user has been updated successfully.' });
    });
});
 
 
//  Delete user
app.delete('/users/:id', function (req, res) {
  
    let user_id = req.params.id;

    console.log('>> delete users');
    console.log(user_id);
  
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
    dbConn.query('DELETE FROM users WHERE id = ?', [user_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'User has been deleted successfully.' });
    });
}); 
 
// set port
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});
 
module.exports = app;
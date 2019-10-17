This repository was created to introduce someone to what JSON and APIs are. I'm not a javascript developer, so please forgive any and all mistakes, as the goal was just the understanding behind what was happening.

1. Install express
  - `$ mkdir express-demo-rich`
  - `$ cd express-demo-rich`
  - `$ npm init`
    - slap enter a bunch to accept the defaults
    - creates a `package.json` file for our application
  - `$ npm install express --save`
    - installs express and saves it as a dependency in our `package.json`
2. Add boiler plate in new file app.js
  ```
  var express = require('express')
  var app = express()

  app.listen(1337, function() {
    console.log('App listening on port 3000')
  })
  ```
3. Run app
  `$ node app.js`
4. Create a GET, "/" hello world
  ```
  app.get('/', function(req, res) {
    res.send('Hello World!')
  })
  ```
5. Add JSON response
  ```
  app.get('/json', function(req, res) {
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ a: 1 }, null, 3))
  })
  ```
6. Add SQLite support
  `$ npm install sqlite3 --save`
7. Add starter code for SQLite
  ```
  var sqlite3 = require('sqlite3').verbose()
  var db = new sqlite3.Database(':memory:')

  db.serialize(function () {
    db.run('CREATE TABLE IF NOT EXISTS messages (content TEXT)')
    var statement = db.prepare('INSERT INTO messages VALUES (?)')
    statement.run('The early worm gets the worm.')
    statement.finalize()
    })
  db.close()
  ```
8. Create endpoint to GET all messages
  ```
  app.get('/message', function(req, res) {
    res.setHeader('Content-Type', 'application/json')
    var db = new sqlite3.Database('db.sqlite3')

    db.all('SELECT rowid AS id, content FROM messages', function (err, rows) {
      if(err) {
        console.log(err)
      }

      res.json({
        "message":"success",
        "data":rows
        })
      })
  })
  ```
9. Install package to parse body
  `$ npm install --save body-parser`
10. Create an endpoint to POST a message
  ```
  app.use(express.json())

  app.post('/ping', function(req, res) {
    var message = req.body.message

    if(message == "ping") {
      res.json({
      "message": "pong",
      })
    } else {
      res.json({
      "message": "send me ping brah",
      })
    }
  })
  ```
11. Use SQLIte
  ```
  app.post('/message', function(req, res) {
    var message = req.body.message
    var db = new sqlite3.Database('db.sqlite3')
    var statement = db.prepare('INSERT INTO messages VALUES (?)')
    statement.run(message)
    statement.finalize()
    db.close()

    res.status(201).end()
  }
  ```
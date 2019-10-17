var express = require('express')
const app = express()
var sqlite3 = require('sqlite3').verbose()

app.use(express.json())

// Initialize our database with a row
var db = new sqlite3.Database('db.sqlite3')
db.serialize(function () {
  db.run('CREATE TABLE IF NOT EXISTS messages (content TEXT)')
  var statement = db.prepare('INSERT INTO messages VALUES (?)')
  statement.run('The early worm gets the worm.')
  statement.finalize()
})
db.close()

app.get('/', function(req, res) {
  res.send('Hello World!')
})

app.get('/json', function(req, res) {
    res.setHeader('Content-Type', 'application/json')

    res.end(JSON.stringify({ a: 1 }, null, 3))
})

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

app.post('/message', function(req, res) {
  var message = req.body.message
  var db = new sqlite3.Database('db.sqlite3')
  var statement = db.prepare('INSERT INTO messages VALUES (?)')
  statement.run(message)
  statement.finalize()
  db.close()

  res.status(201).end()
})

app.listen(1337, function() {
  console.log('Example app listening on port localhost:1337!')
})
//Express server
const connectToMongo=require('./db');
const express = require('express')

connectToMongo();
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('hello world')
  })
app.listen(port, () => {
    console.log(`iNotebook backend listening at http://localhost:${port}`);
});


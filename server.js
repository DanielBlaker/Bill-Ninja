const express = require('express')
const app = express()

app.use(express.static('static'))


app.listen(8080, function (err) {
    if (err) console.log(err);
    console.log("Live at :8080")
});
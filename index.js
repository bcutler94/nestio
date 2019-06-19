const express = require('express');
const app = express();
const routes = require('./routes')(app);

const server = app.listen(3000, () => {
    console.log("Listening on port %s...", server.address().port);
});


const express = require('express');
const app = express();

var appRouter = function (app) {
    app.set('views', './views');
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use("/static", express.static('./static/'));
    app.get("/stats", function (req, res) {
        res.render('stats')
    });
    app.get("/health", function (req, res) {
        res.render('health')
    });
}

module.exports = appRouter;
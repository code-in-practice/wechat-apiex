var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    var query = req.query;
    console.log(query);
    res.render('user', {});
});

router.get('/auth', function (req, res, next) {
    res.render('user', {});
});


module.exports = router;

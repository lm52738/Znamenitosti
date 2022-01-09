var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Home',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

module.exports = router;

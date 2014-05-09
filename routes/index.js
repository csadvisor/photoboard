var express = require('express');
var router = express.Router();
var db = require('./db');

var PHOTOS_PER_PAGE = 12;

/* GET home page. */
router.get('/', function(req, res) {
	renderPhotos(res, 'A', 0);
});

router.param('letter', function(req, res, next, id) {
	req.letter = id.toUpperCase();
	next();
});

router.param('page', function(req, res, next, id) {
	req.page = parseInt(id);
	next();
});

function renderPhotos(res, letter, page) {
	re = new RegExp('^' + letter, 'i');
	var skipAmt = page * PHOTOS_PER_PAGE;
	db.find({lastName: {$regex: re}}).sort({lastName: 1}).skip(skipAmt).exec(function(err, docs) {
		var hasMore = docs.length > PHOTOS_PER_PAGE;
		if (hasMore) {
			docs = docs.slice(0, PHOTOS_PER_PAGE);
		}

		res.render('index', {students: docs, startsWith: letter, page: page, more: hasMore});
	});
}

router.get('/:letter', function(req, res) {
	renderPhotos(res, req.letter, 0);
});

router.get('/:letter/:page', function(req, res) {
	renderPhotos(res, req.letter, req.page);
});

module.exports = router;

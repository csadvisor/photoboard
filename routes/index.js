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

function renderPhotos(res, letter, page, auto) {
	re = new RegExp('^' + letter, 'i');
	var skipAmt = page * PHOTOS_PER_PAGE;
	db.find({lastName: {$regex: re}, active: true}).sort({lastName: 1}).skip(skipAmt).exec(function(err, docs) {
		if (docs.length == 0) {
			var nextLetter = (letter == 'z' || letter == 'Z') ? 'A' : String.fromCharCode(startsWith.charCodeAt(0)+1);
			renderPhotos(res, nextLetter, 0, auto);
		} else {
			var hasMore = docs.length > PHOTOS_PER_PAGE;
			if (hasMore) {
				docs = docs.slice(0, PHOTOS_PER_PAGE);
			}

			res.render('index', {students: docs, startsWith: letter, page: page, more: hasMore, auto: auto});
		}
	});
}

router.get('/:letter', function(req, res) {
	renderPhotos(res, req.letter, 0, req.query.auto);
});

router.get('/:letter/:page', function(req, res) {
	renderPhotos(res, req.letter, req.page, req.query.auto);
});

module.exports = router;

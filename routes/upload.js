/**
 * Module dependencies.
 */

 var express = require('express');
 var multiparty = require('multiparty');
 var format = require('util').format;
 var router = express.Router();
 var fs = require('fs');
 var sys = require('sys')
 var exec = require('child_process').exec;
 var path = require('path');
 var db = require('./db');
 require('log-timestamp');


 router.get('/', function(req, res){
 	res.send('<form method="post" enctype="multipart/form-data">'
 		+ '<p>First Name: <input type="text" name="firstName" /></p>'
 		+ '<p>Last Name: <input type="text" name="lastName" /></p>'
 		+ '<p>Suid: <input type="text" name="suid" /></p>'
 		+ '<p>Image: <input type="file" name="image" /></p>'
 		+ '<p><input type="submit" value="Upload" /></p>'
 		+ '</form>');
 });

 router.post('/', function(req, res, next){
	// create a form to begin parsing
	var form = new multiparty.Form();
	var upload = {};

	form.autoFiles = true;
	form.uploadDir = './public/images/students';
	form.on('error', next);
	form.on('close', function(){
		res.send(format('\nuploaded!'));
	});

	// parse the form
	form.parse(req, function(err, fields, files) {
		var re = /public\/(.*)/;
		var match = re.exec(files.image[0].path);
		var doc = {
			firstName: fields.firstName[0],
			lastName: fields.lastName[0],
			suid: parseInt(fields.suid),
			image: match[1],
			active: false
		};

		db.insert(doc, function(err, newDoc) {
			console.log("Inserted " + doc.firstName + " " + doc.lastName + "!");
		});

		//compress the file at some random point in the next hour to distribute load
		//actually an issue when uploading a ton of photos at the same time
		//like the 'advizor board' command does
		var timeout = Math.floor((Math.random() * 300) + 300) * 1000;
		setTimeout(function() {
			var img = files.image[0].path;
			var cmd = "convert " + img + " -resize 255x340 " + img;
			console.log(cmd);
			exec(cmd, function(err, stdout, stderr) {
				if (err) {
					console.log(stderr);
				} else {
					console.log("resized " + img);
				}
			});
		}, timeout);


	});

});


module.exports = router;
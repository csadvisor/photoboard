var db = require('./db');
var mysql      = require('mysql');
require('log-timestamp');


//check that username and password are defined
if (!process.env.MYSQL_USER) {
	throw 'Need to define environment variable MYSQL_USER';
}

if (!process.env.MYSQL_PWD) {
	throw 'Need to define environment variable MYSQL_PWD';
}

var connection = mysql.createConnection({
	host     : 'cs-db-1.stanford.edu',
	database : 'csdb',
	user     : process.env.MYSQL_USER,
	password : process.env.MYSQL_PWD,
	insecureAuth: true
});

var updateActiveStudents = function() {
	console.log("updating active students...");
	connection.query('select university_id from ug where inactive_qcode = 29999 order by university_id', function(err, rows, fields) {
		if (err) throw err;
		console.log(rows.length + " active students found");
		db.find().sort({suid: 1}).exec(function(err, docs) {
			var localIndex = 0;
			var remoteIndex = 0;
			while (localIndex < docs.length && remoteIndex < rows.length) {
			        var currStudent = docs[localIndex];
				var localSuid = currStudent.suid;
				var remoteSuid = rows[remoteIndex].university_id;
				if (localSuid == remoteSuid) {
				    if (!currStudent.active) {
						db.update({ suid: localSuid }, { $set: { active: true } }, { multi: true }, function (err, numReplaced) {
							if (err) throw err;
						});
						console.log('Adding ' + currStudent.firstName + ' ' + currStudent.lastName);
				    }
					localIndex++;
					remoteIndex++;
				} else if (localSuid < remoteSuid) {
				    if (currStudent.active) {
					db.update({ suid: localSuid }, { $set: { active: false } }, { multi: true }, function (err, numReplaced) {
						if (err) throw err
					});
					console.log('Removing ' + currStudent.firstName + ' ' + currStudent.lastName);
				    }
				    localIndex++;
				} else {
					remoteIndex++;
				}
			}
		});
	});
};


updateActiveStudents();
//update the active users every few minutes
setInterval(updateActiveStudents, 300000);
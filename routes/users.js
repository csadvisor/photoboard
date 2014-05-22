var db = require('./db');
var mysql      = require('mysql');


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
		db.find().sort({suid: 1}).exec(function(err, docs) {
			var myIndex = 0;
			var sqlIndex = 0;
			while (myIndex < docs.length && sqlIndex < rows.length) {
				var mySuid = docs[myIndex].suid;
				var sqlSuid = rows[sqlIndex].university_id;
				if (mySuid == sqlSuid) {
					db.update({ suid: mySuid }, { $set: { active: true } }, { multi: true }, function (err, numReplaced) {
						if (err) throw err
					});
					myIndex++;
					sqlIndex++;
				} else if (mySuid < sqlSuid) {
					myIndex++;
				} else {
					sqlIndex++;
				}
			}
		});
	});
};


updateActiveStudents();
//update the active users every few minutes
setInterval(updateActiveStudents, 300000);
var Datastore = require('nedb')
, db = new Datastore({ filename: 'db/students.db', autoload: true });

// Using a unique constraint with the index
db.ensureIndex({ fieldName: 'suid', unique: true }, function (err) {
	if (err)
		console.log("Couldn't create index!");
});

module.exports = db;
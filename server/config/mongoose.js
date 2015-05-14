var mongoose = require('mongoose'),
	crypto = require('crypto');


module.exports = function(config) {
	mongoose.connect(config.db);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error...'));
	db.once('open', function callback() {
		console.log('multivision db opened');
	});

	var userSchema = mongoose.Schema({
		firstName: String,
		lastName: String,
		username: String,
		salt: String,
		hashed_pwd: String
	});
	userSchema.methods = {
		authenticate: function(passwordToMatch) {
			return hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
		}
	}
	var User = mongoose.model('User', userSchema);

	User.find({}).exec(function(err, collection) {
		if (collection.length === 0) {
			var salt, hash;

			salt = createSalt();
			hash = hashPwd(salt, 'abakde');
			User.create({
				firstName: 'Aniket',
				lastName: 'Bakde',
				username: 'abakde',
				salt: salt,
				hashed_pwd: hash
			});

			salt = createSalt();
			hash = hashPwd(salt, 'ajagtap');
			User.create({
				firstName: 'Amol',
				lastName: 'Jagtap',
				username: 'ajagtap',
				salt: salt,
				hashed_pwd: hash
			});

			salt = createSalt();
			hash = hashPwd(salt, 'dchopra');
			User.create({
				firstName: 'Deepanshu',
				lastName: 'Chopra',
				username: 'dchopra',
				salt: salt,
				hashed_pwd: hash
			});
		}
	})
}

function createSalt() {
	return crypto.randomBytes(128).toString('base64');
}

function hashPwd(salt, pwd) {
	var hmac = crypto.createHmac('sha1', salt);
	return hmac.update(pwd).digest('hex');
}
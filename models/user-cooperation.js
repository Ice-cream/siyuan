/**
 * Created by cin on 1/20/14.
 */
var _ = require('underscore'),
	chance = new (require('chance'))(),
	syBookshelf = require('./base'),
	User = require('./user'),
	Users = User.Set,
	UserCooperation, UserCooperations,
	fkUser = 'userid';

UserCooperation = module.exports = syBookshelf.Model.extend({
	tableName: 'user_cooperation',
	fields: [
		'id', 'userid', 'cooperationid', 'isaccepted'
	],
	user: function () {
		return this.belongsTo(User, fkUser);
	}
}, {
	find: function (query) {
		var forUserCooperation = ['id', 'userid', 'cooperationid', 'isaccepted'],
			usercooperations = UserCooperations.forge();
		return usercooperations
			.query(function (qb) {
				_.each(forUserCooperation, function (k) {
					if (k in query) {
						qb.where(k, query[k]);
					}
				});
			})
			.query('offset', query['offset'])
			.query('limit', query['limit'])
			.fetch();
	}
});

UserCooperations = UserCooperation.Set = syBookshelf.Collection.extend({
	model: UserCooperation
});
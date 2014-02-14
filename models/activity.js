var fs = require('fs'),
	path = require('path'),
	_ = require('underscore'),
	chance = new (require('chance'))(),
	Promise = require('bluebird'),
	errors = require('../lib/errors'),
	syBookshelf = require('./base'),
	ActivityStatus = require('./activity-status'),
	UserActivity = require('./user-activity'),
	UserActivities = UserActivity.Set,
	config = require('../config'),
	fkActivity = 'activityid',
	fkOwner = 'ownerid',
	fkStatus = 'statusid',
	Activity, Activities;

Activity = module.exports = syBookshelf.Model.extend({
	tableName: 'activities',
	fields: [
		'id', 'ownerid', 'groupid', 'content', 'maxnum', 'createtime',
		'starttime', 'duration', 'statusid', 'avatar', 'money', 'name', 'site',
		'regdeadline'
	],
	withRelated: ['user.profile', 'status'],
	fieldToAssets: { avatar: 'activities' },

	defaults: function () {
		return {
			createtime: new Date()
		}
	},

	toJSON: function () {
		var self = this, Model = this.constructor,
			ret = Model.__super__.toJSON.apply(this, arguments);
		_.each(this.fieldToAssets, function (type, field) {
			if (self.get(field) != null) {
				var file = Model.getAssetPath(type, self.id);
				ret[field] = config.toStaticURI(file) + '?t=' + ret[field];
			}
		});
		return ret;
	},

	saving: function () {
		return Activity.__super__
			.saving.apply(this, arguments);
	},
	usership: function () {
		return this.hasMany(UserActivities, fkActivity);
	},

	fetch: function (options) {
		return Activity.__super__.fetch.call(this, options)
			.then(function (activity) {
				if (!activity) return activity;
				return activity.countUsership();
			})
	},

	countUsership: function () {
		var self = this;
		return UserActivities.forge().query()
			.where(fkActivity, '=', self.id)
			.count('id')
			.then(function (d) {
				return self.data('numUsership', d[0]["count(`id`)"]);
			});
	},

	status: function () {
		return this.belongsTo(ActivityStatus, fkStatus);
	},
	user: function () {
		return this.belongsTo(require('./user'), fkOwner);
	}
}, {
	randomForge: function () {
		var status = _.random(1, 4),
			maxnum = _.random(20, 40),
			duration = _.random(3, 10);
		return Activity.forge({
			'content': chance.paragraph(),
			'maxnum': maxnum,
			'createtime': chance.date({ year: 2013 }),
			'starttime': chance.date({ year: 2013 }),
			'duration': duration,
			'statusid': status,
			'avatar': chance.word(),
			'money': chance.integer({
				min: 600,
				max: 1200
			}),
			'name': chance.word(),
			'site': chance.word(),
			'regdeadline': chance.date({ year: 2013 })
		});
	},

	find: function (query) {
		var forActivity = ['id', 'ownerid', 'groupid', 'content', 'statusid', 'name'],
			activities = Activities.forge();
		return activities
			.query(function (qb) {
				_.each(forActivity, function (k) {
					if (k in query) {
						qb.where(k, query[k]);
					}
				})
			}).query(function (qb) {
				query['orders'].forEach(function (order) {
					qb.orderBy(order[0], order[1]);
				});
			}).query('offset', query['offset'])
			.query('limit', query['limit'])
			.fetch();
	},

	search: function (query) {
		var count = 0;
		return Activities.forge()
			.query(function (qb) {
				['name', 'content'].forEach(function (k) {
					if (k in query) {
						count++;
						qb.where(k, query[k]);
					}
				});
				['ownerid'].forEach(function (k) {
					if (k in query) {
						count++;
						qb.where(k, 'like', '%' + query[k] + '%');
					}
				});
			}).query(function (qb) {
				query['orders'].forEach(function (order) {
					qb.orderBy(order[0], order[1]);
				});
			}).query('offset', query['offset'])
			.query('limit', count ? query['limit'] : 0)
			.fetch();
	}
});

Activities = Activity.Set = syBookshelf.Collection.extend({
	model: Activity,

	fetch: function () {
		return Activities.__super__.fetch.apply(this, arguments)
			.then(function (collection) {
				return collection.invokeThen('fetch');
			});
	}
});

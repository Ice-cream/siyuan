/**
 * Created by Cam on 14-1-4.
 */
var syBookshelf = require('./base'),
	GroupMembers, GroupMembersSet;

Group = module.exports = syBookshelf.Model.extend({
	tableName: 'group_members',
	fields: [
		'id', 'groupid', 'userid', 'isowner', 'isadmin', 'remark'
	],
	omitInJSON: ['id']
});

GroupMembersSet = Group.Collection = syBookshelf.Collection.extend({
	model: Group
});
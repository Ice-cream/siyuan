/**
 * Created by cin on 12/24/13.
 */
var _ = require('underscore'),
    chance = new (require('chance'))(),
    syBookshelf = require('./base'),
    Admin, Admins;

Admin = syBookshelf.Model.extend({
    tableName: 'admin',
    permittedAttrs: ['id', 'username', 'password', 'email', 'regdate', 'lastip', 'lastdate'],
    initialize: function () {
        return this.constructor.__super__.initialize.apply(this, arguments);
    },

    saving: function () {
        var ret = this.constructor.__super__.saving.apply(this, arguments);
        //append 'regtime'
        if (!this.get('regtime')) {
            this.set({
                'regtime': new Date()
            });
        }
        return ret;
    }
}, {
    createRandom: function() {
        return this.forge({
            username: chance.word(),
            password: chance.string(),
            email: chance.email(),
            regdate: chance.date(),
            lastip: chance.ip(),
            lastdate: chance.date()
        });
    }
});

Admins = module.exports = syBookshelf.Collection.extend({
    model: Admin
});
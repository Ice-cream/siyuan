// app environment
// usually -- production | development | test
var defaultEnv = 'development',
	env = process.env['NODE_ENV'];
if (!env) {
	env = process.argv && process.argv[2] || defaultEnv;
	process.env['NODE_ENV'] = env;
}

var path = require('path'),
	rootDir = path.resolve(__dirname, '..'),
	defaultContentDir = path.join(rootDir, 'content.default'),
	contentDir = path.join(rootDir, 'content')
		+ (env == 'test' ? '_test' : '');

module.exports = {
	env: env,
	rootDir: rootDir,

	staticDir: path.join(rootDir, 'static'),
	docsDir: path.join(rootDir, 'docs'),
	adminDir: path.join(rootDir, 'admin'),

	defaultContentDir: defaultContentDir,
	contentDir: contentDir,
	avatarDir: path.join(contentDir, 'avatars'),
	activityAvatarDir: path.join(contentDir, 'activities'),
	photoDir: path.join(contentDir, 'photos'),

	port: 8088,
	secret: 'bad',
	db: {
		client: 'mysql',
		connection: {
			database: 'siyuan'
				+ (env == 'test' ? '_test' : ''),
			host: 'localhost',
			user: 'root',
			password: 'root',
			charset: 'utf8'
		}
	},

	avatarExt: '.jpg',
	admins: [
		{
			username: 'admin1',
			password: '123'
		},
		{
			username: 'admin2',
			password: '123'
		},
		{
			username: 'admin3',
			password: '123'
		}
	]
};

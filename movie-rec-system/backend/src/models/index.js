const sequelize = require('../config/db');
const User = require('./user');
const Movie = require('./Movie');
const Rating = require('./rating');
const MovieFeature = require('./movieFeature');

User.initModel(sequelize);
Movie.initModel(sequelize);
Rating.initModel(sequelize);
MovieFeature.initModel(sequelize);

// Associations
User.hasMany(Rating, { foreignKey: 'userId', onDelete: 'CASCADE' });
Rating.belongsTo(User, { foreignKey: 'userId' });

Movie.hasMany(Rating, { foreignKey: 'movieId', onDelete: 'CASCADE' });
Rating.belongsTo(Movie, { foreignKey: 'movieId' });

// MovieFeature (optional one-to-one)
Movie.hasOne(MovieFeature, { foreignKey: 'movieId', onDelete: 'CASCADE' });
MovieFeature.belongsTo(Movie, { foreignKey: 'movieId' });

module.exports = { sequelize, User, Movie, Rating, MovieFeature };

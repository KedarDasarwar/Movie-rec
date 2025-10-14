const { DataTypes, Model } = require('sequelize');

class Movie extends Model {
  static initModel(sequelize) {
    Movie.init({
      id: { type: DataTypes.INTEGER, primaryKey: true },
      title: { type: DataTypes.STRING, allowNull: false },
      avgRating: { type: DataTypes.FLOAT, allowNull: true, field: 'avg_rating' },    // map to DB column
      ratingCount: { type: DataTypes.INTEGER, allowNull: true, field: 'num_ratings' }, // map to DB column
      genres: { type: DataTypes.STRING, allowNull: true },
      year: { type: DataTypes.INTEGER, allowNull: true },
    }, {
      sequelize,
      modelName: 'Movie',
      tableName: 'movies',
      timestamps: false
    });
  }
}

module.exports = Movie;

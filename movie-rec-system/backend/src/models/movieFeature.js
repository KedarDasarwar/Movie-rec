const { DataTypes, Model } = require('sequelize');

class MovieFeature extends Model {
  static initModel(sequelize) {
    MovieFeature.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      movieId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
      vector: { type: DataTypes.TEXT, allowNull: true } // JSON string of features / vector
    }, {
      sequelize,
      modelName: 'MovieFeature',
      tableName: 'movie_features',
      timestamps: false
    });
  }
}

module.exports = MovieFeature;

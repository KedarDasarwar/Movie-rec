const { DataTypes, Model } = require('sequelize');

class Rating extends Model {
  static initModel(sequelize) {
    Rating.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      movieId: { type: DataTypes.INTEGER, allowNull: false },
      rating: { type: DataTypes.INTEGER, allowNull: false }, // 1-5
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, {
      sequelize,
      modelName: 'Rating',
      tableName: 'ratings',
      timestamps: true
    });
  }
}

module.exports = Rating;

const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Model {
  static initModel(sequelize) {
    User.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      passwordHash: { type: DataTypes.STRING, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: true }
    }, {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true
    });
  }

  async setPassword(password) {
    this.passwordHash = await bcrypt.hash(password, 10);
  }

  async validatePassword(password) {
    return bcrypt.compare(password, this.passwordHash);
  }

  toSafeObject() {
    const { id, email, name, createdAt } = this;
    return { id, email, name, createdAt };
  }
}

module.exports = User;

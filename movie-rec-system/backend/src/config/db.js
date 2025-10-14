const { Sequelize } = require('sequelize');
require('dotenv').config();

const dialect = process.env.DB_DIALECT || 'sqlite';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'moviesdb',
  process.env.DB_USER || null,
  process.env.DB_PASSWORD || null,
  {
    host: process.env.DB_HOST || undefined,
    dialect,
    storage: dialect === 'sqlite' ? process.env.DB_STORAGE || './src/data/database.sqlite' : undefined,
    logging: false,
  }
);

module.exports = sequelize;

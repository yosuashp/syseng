// models/carModels.js

'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    static associate (models) {
      // define association here
    }
  }
  Car.init({
    plate: DataTypes.STRING,
    manufacture: DataTypes.STRING,
    model: DataTypes.STRING,
    image: DataTypes.STRING,
    rentPerDay: DataTypes.INTEGER,
    capacity: DataTypes.INTEGER,
    description: DataTypes.STRING,
    availableAt: DataTypes.DATE,
    transmission: DataTypes.STRING,
    available: DataTypes.BOOLEAN,
    type: DataTypes.STRING,
    year: DataTypes.INTEGER,
    options: DataTypes.JSON, // Ubah tipe data menjadi JSON
    specs: DataTypes.JSON, // Ubah tipe data menjadi JSON
    createdByUser: DataTypes.INTEGER,
    lastUpdatedByUser: DataTypes.INTEGER,
    deletedByUser: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Car',
    paranoid: true
  })
  return Car
}

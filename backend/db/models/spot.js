'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.hasMany(models.Review, { foreignKey: 'spotId' });
      Spot.belongsTo(models.User, { foreignKey: 'ownerId', as: 'Owner' });
      //Spot.belongsTo(models.User, {  });
      Spot.hasMany(models.Booking, { foreignKey: 'spotId' });
      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId' });
    }
  }
  Spot.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ownerId: DataTypes.INTEGER,
    address: {
      type: DataTypes.STRING(300)
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
      validate: {
        min: -90,
        max: 90
      }
    },
    lng: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
      validate: {
        min: -180,
        max: 180
      }
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: DataTypes.TEXT,
    price: {
      type: DataTypes.DECIMAL(20, 2)
    },
    avgRating: {
      type: DataTypes.DECIMAL(1, 1)
      },
      numReviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      previewImage: {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue("previewImage")
      }
      },
    }, {
      sequelize,
      modelName: 'Spot',
    });
    return Spot;
  };
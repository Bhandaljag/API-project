'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, { foreignKey: 'ownerId', as: 'Owner'})
      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId'})
    }
  }
  Spot.init({
    ownerId:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        keys: 'id'
      },
      onDelete: 'CASCADE'
    },
    address: {
     type: DataTypes.STRING,
     allowNull: false,
     validate: {
      notEmpty: true
     }
    },
    city: {
     type: DataTypes.STRING,
     allowNull: false,
     validate: {
      notEmpty: true
     }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    country: {
     type: DataTypes.STRING,
     allowNull: false,
     validate: {
      notEmpty: true
     }
    },
    lat: {
      type:DataTypes.DECIMAL(10, 7),
      allowNull: false,
      validate: {
        min: -90,
        max: 90
      }
    },
    lng: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false,  
      validate: {
        min: -180,
        max: 180
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50]
      }
    },
    description: {
     type: DataTypes.STRING,
     allowNull: false,
     validate: {
      notEmpty: true,
     }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
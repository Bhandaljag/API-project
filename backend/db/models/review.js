'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      }),
      Review.belongsTo(models.Spot, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
      });
      Review.hasMany(models.ReviewImage, {
        foreignKey: 'reviewId',
        onDelete: 'CASCADE',
      });
    }
  }
  Review.init(
    {
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {msg: 'Spot ID required'},
        isInt:{msg: 'Spot ID must be integer'},
      },
    },


    userId: {
   type: DataTypes.INTEGER,
   allowNull: false,
   validate: {
    notNull: { msg: 'User ID required' },
    isInt: { msg: 'User ID must be integer'},
   }
   },
    review: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Review cannot be empty'},
    },
    },
    stars:{
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Stars rating is required' },
        isInt: { msg: 'Stars must be integer'},
        min: 1,
        max: 5
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
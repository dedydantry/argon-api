'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendances extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey:'user_id',
        as:'user'
      })
    }
  }
  Attendances.init({
    user_id:DataTypes.INTEGER,
    periode:DataTypes.DATEONLY,
    clock_in:DataTypes.DATE,
    clock_out:DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Attendances',
    timestamps:true,
    tableName:'attendances'
  });
  return Attendances;
};
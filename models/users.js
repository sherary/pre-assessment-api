'use strict'

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    id: {
      type: DataTypes.BIGINT(16),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize, 
    freezeTableName: true,
    timestamps: true,
    tableName: 'Users'
  });

  Users.associate = models => {
    Users.hasOne(models.Pre_assessments_submissions, {
      onDelete: 'cascade'
    })
  }
  
  return Users;
};
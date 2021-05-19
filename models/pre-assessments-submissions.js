'use strict'

module.exports = (sequelize, DataTypes) => {
  const Pre_assessments_submissions = sequelize.define('Pre_assessments_submissions',{
    user_id: {
      type: DataTypes.BIGINT(16),
      references: {
        model: 'Users',
        key: 'id'
      },
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    
  }, {
      sequelize, 
      freezeTableName: true,
      timestamps: true,
      tableName: 'Pre_assessments_submissions'
  });

  return Pre_assessments_submissions;
};
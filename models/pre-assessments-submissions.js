'use strict'

module.exports = (sequelize, DataTypes) => {
  const Pre_assessments_submissions = sequelize.define('Pre_assessments_submissions',{
    
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

  Pre_assessments_submissions.associate = models => {
    Pre_assessments_submissions.belongsTo(models.Users, {
      onDelete: 'cascade'
    })
  }

  return Pre_assessments_submissions;
};
var DataTypes = require("sequelize").DataTypes;
var _preassessment_backend_submissions = require("./preassessment_backend_submissions");
var _users = require("./users");

function initModels(sequelize) {
  var preassessment_backend_submissions = _preassessment_backend_submissions(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  preassessment_backend_submissions.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(preassessment_backend_submissions, { as: "preassessment_backend_submissions", foreignKey: "user_id"});

  return {
    preassessment_backend_submissions,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

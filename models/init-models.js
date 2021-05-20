var DataTypes = require("sequelize").DataTypes;
var _preassessment_backend_submissions = require("./preassessment_backend_submissions");
var _users = require("./users");

function initModels(sequelize) {
  var preassessment_backend_submissions = _preassessment_backend_submissions(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);


  return {
    preassessment_backend_submissions,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

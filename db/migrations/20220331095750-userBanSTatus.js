'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.sequelize.query("UPDATE User set userBanStatus = 0 where userBanStatus IS NULL;"),
    ])
  },

  down: (queryInterface, Sequelize) => {
   
  }
};
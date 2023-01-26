'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('ListBlockedDates', 'dayStatus', {
        type: Sequelize.ENUM('firstHalf', 'secondHalf', 'full'),
        defaultValue: 'full',
        allowNull: false,
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('ListBlockedDates', 'dayStatus')
    ])
  }
};
import DataType from 'sequelize';
import Model from '../sequelize';
import moment from 'moment';

const ListBlockedDates = Model.define('ListBlockedDates', {

  id: {
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement : true
  },

  listId: {
    type: DataType.INTEGER,
    allowNull: false,
  },

  reservationId: {
    type: DataType.INTEGER,
  },

  blockedDates: {
    type: DataType.DATEONLY,
    allowNull: false,
    get: function(){
      return this.getDataValue('blockedDates') ? moment.utc(this.getDataValue('blockedDates')).format('YYYY-MM-DD') : null;
    }
  },

  calendarId: {
    type: DataType.INTEGER,
  },

  calendarStatus: {
    type: DataType.ENUM('available', 'blocked', 'reservation'),
  },

  isSpecialPrice: {
    type: DataType.INTEGER,
  },

  dayStatus: {
    type: DataType.ENUM('firstHalf', 'secondHalf', 'full'),
    defaultValue: 'full',
    allowNull: false,
  },

});

export default ListBlockedDates;

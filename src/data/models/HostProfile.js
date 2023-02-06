import DataType from 'sequelize';
import Model from '../sequelize';

const HostProfile = Model.define('HostProfile', {

  userId: {
    type: DataType.UUID,
    primaryKey: true,
  },

  hostId: {
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true
  },

  store_type: {
    type: DataType.STRING(100),
  },

  store_ext_id: {
    type: DataType.STRING(100),
  },

  company: {
    type: DataType.STRING(100),
  },

  company_short: {
    type: DataType.STRING(100),
  },

  fullAddr: {
    type: DataType.STRING(255),
  },

  address_1: {
    type: DataType.STRING(50),
  },

  address_2: {
    type: DataType.STRING(50),
  },

  city: {
    type: DataType.STRING(50),
  },

  state: {
    type: DataType.STRING(50),
  },

  country_iso2: {
    type: DataType.TEXT,
  },

  geolocation: {
    type: DataType.GEOMETRY('POINT'),
  },

  phone_num: {
    type: DataType.STRING(100),
  },

  is_blocked: {
    type: DataType.INTEGER
  },

  is_verified: {
    type: DataType.INTEGER
  },

  verified_on: {
    type: DataType.STRING(10)
  },

});

export default HostProfile;

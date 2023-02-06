import DataType from 'sequelize';
import Model from '../sequelize';
import bcrypt from 'bcrypt';

const User = Model.define('User', {

  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },

  email: {
    type: DataType.STRING(255),
    validate: { isEmail: true },
    allowNull: false,
  },

  password: {
    type: DataType.STRING,
    allowNull: false,
  },

  emailConfirmed: {
    type: DataType.BOOLEAN,
    defaultValue: false,
  },

  type: {
    type: DataType.STRING,
  },

  userBanStatus: {
    type: DataType.BOOLEAN,
    defaultValue: false,
  },

  // role: {
  //   type: DataType.ENUM("USER", "HOST", "ADMIN"),
  //   // allowNull: false,
  //   defaultValue: "USER",
  // },
  userDeletedAt: {
    type: DataType.DATE,
  },

  userDeletedBy: {
    type: DataType.STRING,
  },
  createdAt: {
    type: DataType.DATE,
  },
  updatedAt: {
    type: DataType.DATE,
  }
}, {
  freezeTableName: true, // Model tableName will be the same as the model name
  timestamps: false,
  underscored: true,
  indexes: [
    { fields: ['email'] },
  ],
});

User.prototype.generateHash = function (password) { // eslint-disable-line  
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

export default User;


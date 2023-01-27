import Sequelize from 'sequelize';
import { databaseConfig, environment } from '../config';
const Op = Sequelize.Op;

const sequelize = (environment === "PROD")
  ? new Sequelize(
    databaseConfig.database,
    databaseConfig.username,
    databaseConfig.password, {
    dialect: databaseConfig.dialect,
    host: databaseConfig.host,
    logging: false,
    define: {
      freezeTableName: true
    },
    operatorsAliases: {
      $eq: Op.eq,
      $ne: Op.ne,
      $gte: Op.gte,
      $gt: Op.gt,
      $lte: Op.lte,
      $lt: Op.lt,
      $not: Op.not,
      $in: Op.in,
      $notIn: Op.notIn,
      $is: Op.is,
      $like: Op.like,
      $notLike: Op.notLike,
      $between: Op.between,
      $notBetween: Op.notBetween,
      $and: Op.and,
      $or: Op.or,
    }
  })

  : new Sequelize(
    databaseConfig.database,
    databaseConfig.username,
    databaseConfig.password, {
    dialect: databaseConfig.dialect,
    host: databaseConfig.host,
    logging: true,
    define: {
      freezeTableName: true
    },
    operatorsAliases: {
      $eq: Op.eq,
      $ne: Op.ne,
      $gte: Op.gte,
      $gt: Op.gt,
      $lte: Op.lte,
      $lt: Op.lt,
      $not: Op.not,
      $in: Op.in,
      $notIn: Op.notIn,
      $is: Op.is,
      $like: Op.like,
      $notLike: Op.notLike,
      $between: Op.between,
      $notBetween: Op.notBetween,
      $and: Op.and,
      $or: Op.or,
    }
  });


  sequelize.sync().then(function(){
    console.log('DB connection sucessful.');
  }, function(err){
    // catch error here
    console.log(err);
  
  });
  
export default sequelize;

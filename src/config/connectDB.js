const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('demosern', 'root', "123456", {
   host: '127.0.0.1',
   port: 3330,
   dialect: 'mysql',
   logging: false
});

let connectDB = async () => {
   try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
   } catch (error) {
      console.error(error);
   }
}

module.exports = connectDB;
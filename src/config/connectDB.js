const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('demosern', 'root', 'quan220424', {
   host: 'localhost',
   dialect: 'mysql',
   logging: false
});

let connectDB = async () => {
   try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
   } catch (error) {
      console.error('');
   }
}

module.exports = connectDB;
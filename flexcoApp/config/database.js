const Sequelize = require('sequelize')
module.exports = new Sequelize('catlog_mndvox', 'root', 'adfLJIOBjmczc@98j', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    // to add timestamp value createdAt and updatedAt to all table
    timestamps: true
  },

  // for details on pool : https://stackoverflow.com/questions/35525574/how-to-use-database-connections-pool-in-sequelize-js
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

});




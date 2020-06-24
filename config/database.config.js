module.exports = {
  development: {
    sql: {
      // database: 'suchitwa',
      // username: 'postgres',
      // password: 'suchitwa'
      database: 'mathen-fish',
      username: 'root',
      password: '', 
      host: 'localhost',
      dialect: 'mysql',
      logging: true,
      pool: {
        max: 9,
        min: 0,
        idle: 10000
      } 
    },
    mongo: 
      { 
        url:"mongodb://localhost:27017/foodbook",
        useNewUrlParser: true,
        useUnifiedTopology: true
  
      }
    

  },
  qa: {
    sql: {
      // database: 'suchitwa',
      // username: 'postgres',
      // password: 'suchitwa'
      database: 'suchitwa_mission',
      username: 'developer',
      password: 'Projects@2019.com'
    }
  }

}

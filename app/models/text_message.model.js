module.exports = function TextMessage(sequelize) {
    var Sequelize = sequelize.constructor;
    // var authPermission = require('./authPermission.model') (sequelize);

    var ret =
      sequelize.define('textMessage', {
        from_phone: {
          type: Sequelize.STRING
        },
        to_phone : {
          type: Sequelize.STRING
        },
        message : {
          type: Sequelize.STRING
        },
        meta_info : {
          type: Sequelize.STRING
        },
        flag : {
          type: Sequelize.INTEGER
        },
        is_sent : {
          type: Sequelize.INTEGER
        },
        sent_at : {
          type: 'TIMESTAMP',
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: true
        },
        status: {
          type: Sequelize.INTEGER
        },
        created_at: {
          type: 'TIMESTAMP',
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: false
        },
        modified_at: {
          type: 'TIMESTAMP',
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: false
        },
  
      }, {
        tableName: 'text_message',
        timestamps: false
  
      });
      // ret.hasMany(authPermission, {foreignKey: 'auth_controller_id'});
  
    return ret;
  }
  
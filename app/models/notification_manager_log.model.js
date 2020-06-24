module.exports = function NotificationManagerLog(sequelize) {
    var Sequelize = sequelize.constructor;
    // var authPermission = require('./authPermission.model') (sequelize);

    var ret =
      sequelize.define('notificationManagerLog', {
        message_type: {
          type: Sequelize.STRING
        },
        data : {
          type: Sequelize.STRING
        },
        flag : {
          type: Sequelize.INTEGER
        },
        meta_info : {
          type: Sequelize.STRING
        },
        sent_at : {
          type: 'TIMESTAMP',
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: false
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
        tableName: 'notification_manager_log',
        timestamps: false
  
      });
      // ret.hasMany(authPermission, {foreignKey: 'auth_controller_id'});
  
    return ret;
  }
  
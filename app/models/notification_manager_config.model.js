module.exports = function NotificationManagerConfig(sequelize) {
    var Sequelize = sequelize.constructor;
    // var authPermission = require('./authPermission.model') (sequelize);

    var ret =
      sequelize.define('notificationManagerConfig', {
        name: {
          type: Sequelize.STRING
        },
        onesignal_app_id : {
          type: Sequelize.STRING
        },
        onesignal_api_key : {
          type: Sequelize.STRING
        },
        twillio_api_key : {
          type: Sequelize.STRING
        },
        msg91_api_key : {
          type: Sequelize.STRING
        },
        sendgrid_api_key : {
          type: Sequelize.STRING
        },
        scanning_interval_seconds_push_messages : {
          type: Sequelize.FLOAT
        },
        scanning_interval_seconds_text_messages : {
          type: Sequelize.FLOAT
        },
        scanning_interval_seconds_email_messages : {
          type: Sequelize.FLOAT
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
        tableName: 'notification_manager_config',
        timestamps: false
  
      });
      // ret.hasMany(authPermission, {foreignKey: 'auth_controller_id'});
  
    return ret;
  }
  
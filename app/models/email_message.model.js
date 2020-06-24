module.exports = function EmailMessage(sequelize) {
    var Sequelize = sequelize.constructor;
    // var authPermission = require('./authPermission.model') (sequelize);

    var ret =
      sequelize.define('emailMessage', {
        from_first_name: {
          type: Sequelize.STRING
        },
        from_middle_name : {
          type: Sequelize.STRING
        },
        from_last_name : {
          type: Sequelize.STRING
        },
        to_first_name : {
          type: Sequelize.STRING
        },
        to_middle_name : {
          type: Sequelize.STRING
        },
        to_last_name : {
          type: Sequelize.STRING
        },
        from_email : {
          type: Sequelize.STRING
        },
        to_email : {
          type: Sequelize.STRING
        },
        cc_emails_csv : {
          type: Sequelize.STRING
        },
        bcc_emails_csv : {
          type: Sequelize.STRING
        },
        subject : {
          type: Sequelize.STRING
        },
        message : {
          type: Sequelize.STRING
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
        tableName: 'email_message',
        timestamps: false
  
      });
      // ret.hasMany(authPermission, {foreignKey: 'auth_controller_id'});
  
    return ret;
  }
  
module.exports = function Notification(sequelize) {
  // var product = require('./product.model')(sequelize);
  // var deliveryAnnouncementProduct = require('./delivery_announcement__product.model')(sequelize);

  var Sequelize = sequelize.constructor;
  var ret =
    sequelize.define('notification', {
      title: {
        type: Sequelize.STRING
      },
      message: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      reference_id: {
        type: Sequelize.INTEGER
      },
      delivery_location_id: {
        type: Sequelize.INTEGER
      },
      meta_info: {
        type: Sequelize.STRING
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
        allowNull: true
      },

    }, {
      tableName: 'notification',
      timestamps: false

    });
   
  // ret.belongsTo(product, {foreignKey: 'product_id'});
  // ret.belongsTo(deliveryAnnouncementProduct, {foreignKey: 'delivery_announcement__product_id'});
  
  return ret;
}

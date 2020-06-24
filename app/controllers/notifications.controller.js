
var gateway = require('../components/gateway.component.js');

const Sequelize = require('sequelize');

const Op = Sequelize.Op;
function notificationsController(methods, options) {

const Notification = methods.loadModel('notification');
const PushMessage = methods.loadModel('push_message');

    this.getPushNotifications = async (req, res) => {
        console.log("current date : " + new Date())
        let currentDate = new Date(new Date() - 5000);
        console.log("5s after date : " + currentDate)

        let newPushNotificationData = await Notification.findAll({
            where: {
                created_at: {
                        [Op.gte]: currentDate
                },
                status: 1
            }
        })
            .catch(err => {
                return {
                    success: 0,
                    message: 'Something went wrong while getting notifications',
                    error: err
                }
            })
        if (newPushNotificationData && newPushNotificationData.error && (newPushNotificationData.error !== null)) {
            return res.send(newPushNotificationData);
        }
        if(newPushNotificationData){
            // await Promise.all(newPushNotificationData.map(async (notification) => {
                 
            // }));
            res.send(newPushNotificationData);

        }else{
            res.send({
                success : 1,
                notifications : [],
                message : "No notifications"
            });

        }

    }


}
module.exports = notificationsController

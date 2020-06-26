
var gateway = require('../components/gateway.component.js');

const Sequelize = require('sequelize');
const OneSignal = require('onesignal-node');
const client = new OneSignal.Client('65011cfa-62d9-4e0c-b249-cb3f679da7d9', 'ZGUxYThkNzctM2MxMC00MWM0LTk3Y2YtYjk5MDY1NGQxMThk');
const Op = Sequelize.Op;
function notificationsController(methods, options) {

    const MysqlNotificationManagerConfig = methods.loadModel('notification_manager_config');
    const MysqlPushMessage = methods.loadModel('push_message');
    const MysqlNotificationManagerLog = methods.loadModel('notification_manager_log');
    const constants = require('../helpers/constants');

    // const Notification = methods.loadModel('notification');
    const MongodbNotificationManagerConfig = require('../models/notificationManagerConfigs.model');
    const MongodbPushMessage = require('../models/pushMessages.model');
    const MongodbNotificationManagerLog = require('../models/notification_manager_log.model');

    this.isProcessingOnGoing = false;
    this.scanningIntervalSeconds = 5;
    this.isMySqlDb = true;
    this.isMongoDb = false;
    this.timer = null;
    this.oneSignalConfig = null;
    this.oneSignalClient = null;
    this.loadConfig = async () => {

        this.isMongoDb = options.mongoose !== undefined;
        this.isMySqlDb = options.sequelize !== undefined;
        await this.loadSettings();
      
        if (this.oneSignalConfig) {
            this.oneSignalClient = new OneSignal.Client(this.oneSignalConfig.oneSignalAppId, this.oneSignalConfig.oneSignalApiKey);
        }


        /**?
         * 1. Identify the db 
         * 2. Update isMysqldb and ismongodb
         * 3. call find scanning interval
         * 4.  Init scanning interval
         * 
         * 
         */
    }
    this.reloadConfig = async () => {
        this.isProcessingOnGoing = false;
        this.scanningIntervalSeconds = 5;
        this.isMySqlDb = true;
        this.isMongoDb = false;
        this.timer = null;
        this.oneSignalConfig = null;
        this.oneSignalClient = null;
        /**?
         * 1. Stop the timer
         * 2. set timer as null
         * 3. all confiq values to initial values
         * 4. call start
         * 
         * 
         */
    }
    this.loadSettingsForMySqlDb = async () => {
        let scanningIntervalData = await MysqlNotificationManagerConfig.findOne({
            where: {
                status: 1
            },
            attributes: ['scanning_interval_seconds_push_messages', 'onesignal_api_key', 'onesignal_app_id']
        })
            .catch(err => {
                return {
                    success: 0,
                    message: 'Something went wrong while getting notifications',
                    error: err
                }
            })

        if (scanningIntervalData && !scanningIntervalData.error) {
            this.scanningIntervalSeconds = parseFloat(scanningIntervalData.scanning_interval_seconds_push_messages);
            this.oneSignalConfig = {
                oneSignalAppId: scanningIntervalData.onesignal_app_id,
                oneSignalApiKey: scanningIntervalData.onesignal_api_key,
            }
        }

    }
    this.loadSettingsForMongoDb = async () => {
        let scanningIntervalData = await MongodbNotificationManagerConfig.findOne({
            status: 1
        }, {
            scanningIntervalPushMessages: 1,
            onesignalApiKey: 1,
            onesignalAppId: 1
        })
            .catch(err => {
                return {
                    success: 0,
                    message: 'Something went wrong while getting notification config',
                    error: err
                }
            })

        if (scanningIntervalData && !scanningIntervalData.error) {
            this.scanningIntervalSeconds = parseFloat(scanningIntervalData.scanningIntervalSecondsPushMessages);
            this.oneSignalConfig = {
                oneSignalAppId: scanningIntervalData.onesignalAppId,
                oneSignalApiKey: scanningIntervalData.onesignalApiKey,
            }
        }
    }
    this.loadSettings = async () => {
        if (this.isMongoDb) {
            await this.loadSettingsForMongoDb();

        } else if (this.isMySqlDb) {
            await this.loadSettingsForMySqlDb();
        }
        return this.scanningIntervalSeconds;

    }
    this.nextIteration = () => {
        var that = this;
        this.timer = setTimeout(async () => {
            await that.doProcessing();
        }, this.scanningIntervalSeconds * 1000);

    }
    this.doProcessing = async () => {
        if (!this.isProcessingOnGoing) {
            this.isProcessingOnGoing = true;
            await this.handleNewPushMessages();
        }
        return this.nextIteration();
    }
    this.start = async () => {
        if (this.timer === null) {
            await this.loadConfig();
            await this.nextIteration();
            this.isProcessingOnGoing = false;

        }

        /*
        0.if timer is null do following
        1. run a timer which runs every x seconds, where x is our scanning interval for push messages
        2. inside the timer funtion, if isProcessingongoing is true, do nothing
        3. else make is processing ongoing to true 
        4. call handleNewPushMessages
        5. once finished, markis processing ongoing as false
        6.return response as already running or restarted
        */
    }
    this.handleNewPushMessages = async (req, res) => {
        var notificationList = [];
        if (!this.oneSignalConfig) {
            return this.reloadConfig();
        }
        if (this.isMongoDb) {
            notificationList = await this.getPushMessageFromMongoDb();
        } else if (this.isMySqlDb) {
            notificationList = await this.getPushMessageFromMySqlDb();
        }
        await this.processPushNessages(notificationList)
        /*
    1. identify db
    
    2. call the respective notfication list fn
    3. pass the list to to processPushNessages fn
    
        */
    }

    this.processPushNessages = async (notificationsList) => {
        notificationsList = JSON.parse(JSON.stringify(notificationsList));
        if (this.isMongoDb) {
            await Promise.all(notificationsList.map(async (notification) => {
                await this.sendPushNotificationMongoDb(notification);
                let updateData = await this.markAsSentToMongoDb(notification);
                let insert = await this.insertLogToMongoDb(notification);

            }));
        }
        else if (this.isMySqlDb) {
            await Promise.all(notificationsList.map(async (notification) => {
                const areThereAnyCommas = notification.segments_csv.includes(',');
                if (areThereAnyCommas) {
                    notification.segments_csv = notification.segments_csv.split(',');
                }
                if (notification.filters_json_arr) {
                    notification.notification.filters_json_arr = JSON.parse(notification.notification.filters_json_arr);
                }
                notification.sent_at = 
                await this.sendPushNotificationMySql(notification);
                let updateData = await this.markAsSentToMySqlDb(notification);
                let insert = await this.insertLogToMySqlDb(notification);

            }));

        }
        /*
1. for each items in list do the following
a. call send Push notification
b. call mark push notification as sent
        */
    }

    this.getPushMessageFromMySqlDb = async () => {
        let notificationList = await MysqlPushMessage.findAll({
            where: {
                is_sent: 0,
                status: 1
            }
        })
            .catch(err => {
                return {
                    success: 0,
                    message: 'Something went wrong while listing push notification ',
                    error: err
                }
            })
        if (notificationList && notificationList.error && (notificationList.error !== null)) {
            return [];
        }

        return notificationList;

        //return all messages with status 1 and not sent, from mysql db
    }

    this.getPushMessageFromMongoDb = async () => {
        let notificationList = await MongodbPushMessage.findAll({
            is_sent: 0,
            status: 1
        })
            .catch(err => {
                return {
                    success: 0,
                    message: 'Something went wrong while listing push notification ',
                    error: err
                }
            })
        if (notificationList && notificationList.error && (notificationList.error !== null)) {
            return [];
        }

        return notificationList;
        //return all messages with status 1 and not sent, from mongo db

    }

    this.sendPushNotificationMySql = async (notification) => {
        /*
        1. Sends push notifciation using the given notification object through onesignal
        2. call insertonotificationmanagerlog with the raw message to onesignal
        */

        var notificationData = {
            contents: {
                'tr': notification.title,
                'en': notification.message,
            },
            included_segments: notification.segments_csv,
            filters: notification.filters_json_arr
        };

        // using async/await
        try {
          
            const response = await this.oneSignalClient.createNotification(notificationData);
            console.log("response");
            console.log(response);
            console.log("response");
            console.log(response.body.id);

        } catch (e) {
            console.log("e")
            console.log(e)
            console.log("e")
            if (e instanceof OneSignal.HTTPError) {
                // When status code of HTTP response is not 2xx, HTTPError is thrown.
                console.log(e.statusCode);
                console.log(e.body);
            }
        }

    }



    this.sendPushNotificationMongoDb = async (notification) => {
        /*
        1. Sends push notifciation using the given notification object through onesignal
        2. call insertonotificationmanagerlog with the raw message to onesignal
        */
        
        var notificationData = {
            contents: {
                'tr': notification.title,
                'en': notification.message,
            },
            included_segments: notification.segmentsCsv,
            filters: notification.filtersJsonArr
        };

        // using async/await
        try {
            const response = await this.oneSignalClient.createNotification(notificationData);
            console.log(response.body.id);
            let insert = await this.insertLog(notification);

        } catch (e) {
            if (e instanceof OneSignal.HTTPError) {
                // When status code of HTTP response is not 2xx, HTTPError is thrown.
                console.log(e.statusCode);
                console.log(e.body);
            }
        }

    }

    this.insertLog = async (notification) => {
        /*
        1. identify the db
        2.  call the corresponding log fn
        */
        if (this.isMySqlDb) {
            let insertLog = await this.insertLogToMySqlDb(notification);

        } else if (this.isMongoDb) {
            let insertLog = await this.insertLogToMongoDb(notification);
        }
    }


    this.insertLogToMySqlDb = async (notification) => {
        let data = await MysqlPushMessage.findOne({
            where : {
                id : notification.id,
                status : 1
                // is_sent : 1
            },
            // attributes:['sent_at']
        })
        .catch(err => {
            return {
                success: 0,
                message: 'Something went wrong while get mongodb push message',
                error: err
            }
        })

    if (data && data.error && (data.error !== null)) {
        return false
    }
 
      data =  JSON.parse(JSON.stringify(data));
        let notificationData = JSON.stringify(notification);
        let logObj = {
            message_type : constants.PUSH_MESSAGE_TYPE,
            data : notificationData,
            sent_at : new Date(data.sent_at),
            status : 1
        }
        let logData = await MysqlNotificationManagerLog.create(logObj)
            .catch(err => {
                return {
                    success: 0,
                    message: 'Something went wrong while creating mysql log',
                    error: err
                }
            })
            console.log("logData")
            console.log(logData)
            console.log("logData")

        if (logData && logData.error && (logData.error !== null)) {
            return false
        }
        return true;

    }
    this.insertLogToMongoDb = async (notification) => {
        let data = await MongodbPushMessage.findOne({
                id : notification.id,
                status : 1,
                isSent : 1
        },{
            sentAt : 1
        })
        .catch(err => {
            return {
                success: 0,
                message: 'Something went wrong while get mongodb push message',
                error: err
            }
        })

    if (data && data.error && (data.error !== null)) {
        return false
    }
        let logObj = {
            message_type : constants.PUSH_MESSAGE_TYPE,
            data : notification,
            sentAt : data.sentAt,
            tsCreatedAt: Date.now(),
            tsModifiedAt: null,
            status : 1

        }

        const notificationLogObj = new MongodbNotificationManagerLog(logObj);

        let logData = await notificationLogObj.save()
            .catch(err => {
                return {
                    success: 0,
                    message: 'Something went wrong while creating mongodb log',
                    error: err
                }
            })
        if (logData && logData.error && (logData.error !== null)) {
            return false
        }
        return true;

    }

    this.markAsSentToMySqlDb = async (notification) => {
        let update = {
            is_sent: 1,
            sent_at: new Date(),
            modified_at: new Date()
        }
        let updateData = await MysqlPushMessage.update(update, {
            where: {
                id: notification.id,
                is_sent: 0,
                status: 1,
            }
        })
            .catch(err => {
                return {
                    success: 0,
                    message: 'Something went wrong while mark as sent',
                    error: err
                }
            })
        if (updateData && updateData.error && (updateData.error !== null)) {
            return false;
        }
        return true;

    }

    this.markAsSentToMongoDb = async (notification) => {
        let updateData = await MongodbNotificationManagerConfig.update({
            _id: notification.id,
            isSent: 0,
            status: 1
        }, {
            isSent: 1,
            tsModifiedAt: Date.now(),
            sentAt: Date.now()
        })
            .catch(err => {
                return {
                    success: 0,
                    message: 'Something went wrong while mark as sent',
                    error: err
                }
            })
        if (updateData && updateData.error && (updateData.error !== null)) {
            return false;
        }
        return true;
    }


}
module.exports = notificationsController

module.exports = (app, methods, options) => {
    const notifications = methods.loadController('notifications', options);

    notifications.methods.get('/push', notifications.getPushNotifications, {
        auth: false
    });
    notifications.methods.get('/message', notifications.getMessageNotifications, {
        auth: false
    });
    notifications.methods.get('/email', notifications.getEmailNotifications, {
        auth: false
    });

}

const mongoose = require('mongoose');

function transform(ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.status;
    delete ret.tsCreatedAt;
    delete ret.tsModifiedAt;
}
var options = {
    toObject: {
        virtuals: true,
        transform: function (doc, ret) {
            transform(ret);
        }
    },
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            transform(ret);
        }
    }
};
const EmailMessageSchema = mongoose.Schema({
    fromFirstName: String,
    fromMiddleName: String,
    fromLastName: String,
    toFirstName: String,
    toMiddleName: String,
    toLastName: String,
    fromEmail: String,
    toEmail: String,
    ccEmailsCsv: String,
    bccEmailsCsv: String,
    subject: String,
    message: String,
    isSent: String,
    sentAt : Number,
    status: Number,
    tsCreatedAt: Number,
    tsModifiedAt: Number

},options);
module.exports = mongoose.model('EmailMessage', EmailMessageSchema, 'EmailMessages');
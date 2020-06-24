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
const TextMessageSchema = mongoose.Schema({
    fromPhone: String,
    toPhone: String,
    message: String,
    segmentsCsv: String,
    metaInfo: String,
    flag: Number,
    isSent: String,
    sentAt : Number,
    status: Number,
    tsCreatedAt: Number,
    tsModifiedAt: Number

},options);
module.exports = mongoose.model('TextMessage', TextMessageSchema, 'TextMessages');
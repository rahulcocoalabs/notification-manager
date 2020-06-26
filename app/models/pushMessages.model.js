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
const PushMessageSchema = mongoose.Schema({
    title: String,
    message: String,
    priority: String,
    filtersJsonArr: Array,
    segmentsCsv: Array,
    metaInfo: String,
    flag: Number,
    isSent: Number,
    sentAt : Number,
    status: Number,
    tsCreatedAt: Number,
    tsModifiedAt: Number

},options);
module.exports = mongoose.model('PushMessage', PushMessageSchema, 'PushMessages');
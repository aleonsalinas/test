var mongoose = require('mongoose');
// Setup schema
var feedSchema = mongoose.Schema({
    story_title: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: false
    },
    story_url: {
        type: String,
        required: false
    },
    author:{
        type: String,
        required: true
    },
    url:{
        type: String,
        required: false
    },
    object_id:{
        type: String,
        required: true
    },
    created_at: {
        type: String,
        required: true
    },
    deleted:{
        type: Boolean,
        default:false
    }
});
// Export Feed model
var Feed = module.exports = mongoose.model('feed', feedSchema);
module.exports.get = function (callback, limit) {
    Feed.find(callback).limit(limit);
}
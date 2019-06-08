// Import feed model
Feed = require('./feedModel');
// Handle index actions
exports.index = function (req, res) {
    Feed.get(function (err, feeds) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Feeds retrieved successfully",
            data: feeds
        });
    });
};
// Handle create feed actions
exports.new = function (req, res) {
    Feed.find({object_id: req.body.objectID},function(err, data){
        if(err){
            console.log(err);
            return
        }
        if(data.length == 0) {
            var feed = new Feed();
            feed.story_title = req.body.story_title;
            feed.title = req.body.title;
            feed.author = req.body.author;
            feed.story_url = req.body.story_url;
            feed.url = req.body.url;
            feed.created_at = req.body.created_at;
            feed.object_id = req.body.objectID;
            // save the feed
            if(!(feed.story_url==null&&feed.url==null)){
                feed.save(function (err) {
                    if (err)
                        res.json(err);
                    if(res!=undefined){
                        console.log("New feed created!");
                        res.json({
                            message: 'New feed created!',
                            data: feed
                        });
                    }
                });
            }
            return
        }
    
    });

};

// Handle view feed info
exports.view = function (req, res) {
    Feed.findById(req.params.feed_id, function (err, feed) {
        if (err)
            res.send(err);
        res.json({
            message: 'Feed details loading..',
            data: feed
        });
    });
};
// Handle update feed info
exports.update = function (req, res) {
    Feed.findById(req.params.feed_id, function (err, feed) {
        if (err)
            res.send(err);
        feed.story_title = req.body.story_title;
        feed.title = req.body.title;
        feed.author  = req.body.author;
        feed.url_title = req.body.url_title;
        feed.url = req.body.url;
        // save the feed and check for errors
        feed.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'Feed Info updated',
                data: feed
            });
        });
    });
};
// Handle delete feed
exports.delete = function (req, res) {
    Feed.findById(req.params.feed_id, function (err, feed) {
        if (err)
            res.send(err);
        feed.deleted = true;
        // save the feed and check for errors
        feed.save(function (err2) {
            if (err2)
                res.json(err);
            res.json({
                message: 'Feed Info updated',
                data: feed
            });
        });
    });
};
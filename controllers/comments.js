const Comment = require('../models/comment');

module.exports = {
    create,
    delete: deleteComment
}

function create(req, res){
    req.body.countryCode = req.params.id;
    req.body.user = req.user._id
    Comment.create(req.body)
    .then(()=> {res.redirect(`/countries/${req.params.id}`)})
}

function deleteComment(req, res){
    Comment.findByIdAndDelete(req.params.id, function(err) {
        res.redirect(`/countries/${req.query.countryCode}`)
    })
}
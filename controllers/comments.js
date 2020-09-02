const Comment = require('../models/comment');

module.exports = {
    create
}

function create(req, res){
    req.body.countryCode = req.params.id;
    req.body.user = req.user._id
    Comment.create(req.body)
    .then(()=> {res.redirect(`/countries/${req.params.id}`)})
}
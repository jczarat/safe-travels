const Comment = require('../models/comment');
const request = require('request');
const rootURL = 'https://www.travel-advisory.info/api';

module.exports = {
    create,
    delete: deleteComment,
    edit,
    update
}

function create(req, res) {
    req.body.countryCode = req.params.id;
    req.body.user = req.user._id
    Comment.create(req.body)
        .then(() => { res.redirect(`/countries/${req.params.id}`) })
}

function deleteComment(req, res) {
    Comment.findByIdAndDelete(req.params.id, function (err) {
        res.redirect(`/countries/${req.query.countryCode}`)
    })
}

function edit(req, res) {
    const countryCode = req.query.countryCode
    const editCommentId = req.params.id
    console.log(countryCode)
    const options = {
        url: `${rootURL}?countrycode=${countryCode}`
    }
    request(options, function (err, response, body) {
        const dataBody = JSON.parse(body);
        const country = dataBody.data[countryCode];
        Comment.find({ countryCode: countryCode }).populate('user').exec(function (err, comments) {
            Comment.findById(req.params.id, function (err, comment) {
                console.log(editCommentId)
                res.render('comments/update', { title: 'Update Comment', country, comments, comment, editCommentId });
            })
        })
    })
}

function update(req, res) {
    Comment.findById(req.params.id, function (err, comment) {
        comment.text = req.body.text
        comment.save(function (err) {
            res.redirect(`/countries/${req.query.countryCode}`)
        })
    })
}
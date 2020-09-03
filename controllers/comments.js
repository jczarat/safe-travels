const Comment = require('../models/comment');
const request = require('request');
const rootURL = 'https://www.travel-advisory.info/api';
const covidRootURL = 'https://api.covid19api.com/summary';
const token = process.env.GOOGLE_MAPS_TOKEN;

module.exports = {
    create,
    delete: deleteComment,
    edit
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

function edit(req, res) {
    let editing = true;
    const countryCode = req.params.countryId
    console.log(countryCode)
    const options = {
        url: `${rootURL}?countrycode=${countryCode}`
    }
    const covidOptions = {
        url: covidRootURL
    }
    request(options, function(err, response, body){
        const dataBody = JSON.parse(body);
        const country = dataBody.data[countryCode];
        request(covidOptions, function(err, response, body){
            const covidBody = JSON.parse(body);
            const covidCountry = covidBody.Countries.find(place => place.CountryCode === countryCode);
            Comment.find({countryCode: req.params.id}).populate('user').exec(function(err, comments){
                Comment.findById(req.params.commentId, function(err, comment){
                    console.log(country)
                    res.render('countries/show', {title: 'Specific Country', country, comments, comment, token, covidCountry, editing});
                })
            });
        });
    });
}
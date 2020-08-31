const Comment = require('../models/comment')
const request = require('request');
const rootURL = 'https://www.travel-advisory.info/api'

module.exports = {
    index,
    show
}

function index(req, res){
    const options = {
        url: rootURL
    };
    request(options, function(err, response, body){
        const dataBody = JSON.parse(body);
        const countries = dataBody.data;
        res.render('countries/index', {title: 'All Countries', countries});
    })
}

function show(req, res){
    const countryCode = req.params.id
    const options = {
        url: `${rootURL}?countrycode=${countryCode}`
    }
    request(options, function(err, response, body){
        const dataBody = JSON.parse(body);
        const country = dataBody.data[countryCode];
        Comment.find({countryCode: req.params.id}).populate('user').exec(function(err, comments){
            console.log(comments)
            res.render('countries/show', {title: 'Specific Country', country, comments});
        });
    });
}


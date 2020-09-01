const Comment = require('../models/comment');
const User = require('../models/user');
const request = require('request');
const rootURL = 'https://www.travel-advisory.info/api'

module.exports = {
    index,
    addFavorite,
    deleteFavorite
}

function index(req, res){
    const options = {
        url: rootURL
    };
    request(options, function(err, response, body){
        const dataBody = JSON.parse(body);
        let countriesArray = Object.values(dataBody.data);
        res.render('favorites/index', {title: 'All Countries', countriesArray});
    })
}

function addFavorite(req, res){
    req.user.favorites.push({countryCode: req.params.id});
    req.user.save(function(err) {
        res.redirect('/favorites');
      });
    console.log(req.user.favorites);
}

function deleteFavorite(req, res){
    let idx = req.user.favorites.findIndex(function(favorite){
        return favorite.countryCode === req.params.id
    });
    req.user.favorites[idx].remove();
    req.user.save(function(err) {
        res.redirect('/favorites');
      });
    console.log(req.user.favorites);
}
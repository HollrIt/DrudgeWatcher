var storage = require('node-persist');
var hollrit = require('hollrit');
var feed = require('feed-read');
var login = hollrit.login;
var send = hollrit.send;

storage.initSync();

if (!storage.getItem('myData'))
    storage.setItem('myData', { drudgeTopHeadline: '' });

function checkFeed() {

    feed("http://feeds.feedburner.com/DrudgeReportFeed", function (err, articles) {
        var topItem = articles[0].title;
        var lastTopItem = storage.getItem('myData').drudgeTopHeadline;

        if (topItem !== lastTopItem) {
            login('Your HollrIt Username', 'Your Hollrit Password').then(function (currentUser) {
                send(currentUser, 'Drudge', topItem);
            });
        }
        storage.setItem('myData', { drudgeTopHeadline: topItem });
    });

    setTimeout(checkFeed, 300000);
}

checkFeed();

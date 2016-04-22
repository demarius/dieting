var ejs = require('ejs')
var fs = require('fs')
var cadence = require('cadence')

function Templater (url) {
    this._landing, this._url = url, this._js
}

Templater.prototype.init = cadence(function (async) {
    async(function () {
        fs.readFile('./pages/index.html', async())
        fs.readFile('./js/board.js', async())
        fs.readFile('./pages/users.html', async())
    }, function (home, src, users) {
        this._js = src.toString() // handlebars does not support JS injection,
        // making tests impossible. ejs instead.
        this._elanding = ejs.compile(home.toString())
        this._users = ejs.compile(users.toString())
    })
})

Templater.prototype.home = function (title) {
    return this._elanding({
        title: title ? title : 'Welcome to the Dieting board!',
        url: this._url,
        src: this._js
    })
}

Templater.prototype.list = function (users) {
    if (Object.keys(users).length < 1) {
        users = { 'No users yet!': 'black' }
    }
    return this._users({ users: users })
}

module.exports = Templater

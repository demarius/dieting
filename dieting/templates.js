var handlebars = require('handlebars')
var ejs = require('ejs')
var fs = require('fs')
var cadence = require('cadence')

function Templater (url) {
    this._landing, this._url = url, this._js

    handlebars.registerHelper('list_users', function (agents, options) {
        var out = '<ul>'
        for (var key in agents) {
            out += '<li>' + key + ' : ' + agents[key].color + ' </li>'
        }
        out += '</ul>'
        return out
    })
    this._users = handlebars.compile('<div>{{list_users agents}}</div>')
}

Templater.prototype.init = cadence(function (async) {
    async(function () {
        fs.readFile('./pages/ejs.html', async())
        fs.readFile('./js/board.js', async())
    }, function (data, js) {
        this._js = js.toString() // handlebars does not support JS injection,
        // making tests impossible. ejs instead.
        this._elanding = ejs.compile(data.toString())
    })
})

Templater.prototype.home = function (title) {
    var title = title ? title : 'Welcome to the Dieting board!'
    return this._elanding({title: title, url: this._url, src: this._js})
}

Templater.prototype.list = function (agents) {
    // create page with username -> color table
    return this._users({agents: agents})
}

module.exports = Templater

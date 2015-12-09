var handlebars = require('handlebars')
var fs = require('fs')
var cadence = require('cadence')

function Templater (url) {
    this._landing, this._url = url

    handlebars.registerHelper('list_users', function (agents, options) {
        var out = '<ul>'
        for (var key in agents) {
            out += '\
            <li>' + key + '\
            : ' + agents[key].color + '\
            </li>'
        }
        return out + '</ul>'
    })
    this._users = handlebars.compile('<div>{{list_users agents}}</div>')
}

Templater.prototype.init = cadence(function (async) {
    async(function () {
        fs.readFile('./pages/index.html', async())
    }, function (data) {
        this._landing = handlebars.compile(data.toString())
    })
})

Templater.prototype.home = function (title) {
    var title = title ? title : 'Welcome to the Dieting board!'
    return this._landing({title: title, url: this._url})
}

Templater.prototype.list = function (agents) {
    // create page with username -> color table
    return this._users({agents: agents})
}

module.exports = Templater

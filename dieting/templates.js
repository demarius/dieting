var handlebars = require('handlebars')
var fs = require('fs')
var cadence = require('cadence')

function Templater () {
    this._landing = '<html><head> <title>{{title}}</title> </head> <body>\
<canvas id="board" resize></canvas> </body>' // just in case `index.hbs` doesn't
// come home tonight

    handlebars.registerHelper('list_users', function (agents, options) {
        var out = '<ul>'
        for (var key in Object.keys(agents)) {
            out += '\
            <li>' + key + '\
            : ' + options.fn(agents[key].color) + '\
            </li>'
        }
        return out + '</ul>'
    })
    this._users = handlebars.compile('<div>{{list_users agents}}</div>')
}

Templater.prototype.init = cadence(function (async) {
    async(function () {
        fs.readFile('./pages/index.hbs', async())
    }, function (data) {
        this._landing = handlebars.compile(data.toString())
    })
})

Templater.prototype.home = function (title) {
    var title = title ? title : 'Welcome to the Dieting board!'
    return this._landing({title: title})
}

Templater.prototype.list = function (agents) {
    // create page with username -> color table
    return this._users(agents)
}

module.exports = Templater

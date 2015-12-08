var handlebars = require('handlebars')

function Templater () {
    this._landing = handlebars.compile('<div>home: {{title}}</div>')
    handlebars.registerHelper('list', function (agents, options) {
        var out = '<ul>'
        for (var key in Object.keys(agents)) {
            out += '\
            <li>' + key + '\
            : ' + options.fn(agents[key].color) + '\
            </li>'
        }
        return out + '</ul>'
    })
    this._users = handlebars.compile('<div>{{#list}}</div>')
}

Templater.prototype.home = function (title) {
    var title = title || 'Welcome to the Dieting board!'
    return this._landing({title: title})
}

Templater.prototype.list = function (agents) {
    // create page with username -> color table
    return this._users(agents)
}

module.exports = Templater

var server = require('diet')
var cadence = require('cadence')
var fnv = require('b-tree/benchmark/fnv')
var socket = require('socket.io')
var templater = require('./dieting/templates')

function Dieting () {
    this.app = server()
    this.app.listen('http://localhost:8000')
    this.agents = {}
    this.io = new socket()
    this.templates = new templater()

    this.app.get('/:title', this.index.bind(this))
    this.app.get('user/:username', this.newAgent.bind(this))
    this.app.get('/users/', this.list.bind(this))
    this.app.post('/user/:drawing', this.update.bind(this))
}

Dieting.prototype.index = function ($) {
    var home = this.templates.home($.title)
    $.end(home)
}

Dieting.prototype.newAgent = function ($) {
    if (Object.keys(this.agents).indexOf($.username) < 0) {
        this.agents[$.username] = {
            // need endpoint
            color: this.color($.username)
        }
    }

    $.end(this.agents[$.username].color)
}

Dieting.prototype.color = function (key) {
    // hash to 0-255
    var color = '#', length = Buffer.byteLength(key), key = fnv(new Buffer(key), 0, length)

    function componentToHex(c) {
    /* http://stackoverflow.com/a/5624139 */
        var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
    }
    length = Math.floor(length / 2)
    while (length-- > 0) {
        color += componentToHex(key.readUIntLE(length - 1, 1))
        //key is sorta flipped here. still unique.
    }
    return color
}

Dieting.prototype.update = function ($) {
    io.emit($.username, {
        color: this.agents[$.username].color,
        drawing: {}
    })
}

Dieting.prototype.list = function ($) {
    $.end(this.templates.list(this.agents))
}

exports.Dieting = Dieting

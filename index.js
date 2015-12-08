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
    this.app.get('/title/:title', this.index.bind(this))
    this.app.get('/user/:username', this.newAgent.bind(this))
    this.app.get('/users/', this.list.bind(this))
    this.app.post('/user/:drawing', this.update.bind(this))
}

Dieting.prototype.index = function ($) {
    $.end(this.templates.home($.params.title))
}

Dieting.prototype.newAgent = function ($) {
    if (Object.keys(this.agents).indexOf($.params.username) < 0) {
        this.agents[$.params.username] = {
            // need endpoint
            color: this.color($.params.username)
        }
    }

    $.end(this.agents[$.params.username].color)
}

Dieting.prototype.color = function (key) {
    // hash to 0-255
    var color = '#', length = Buffer.byteLength(key), key = fnv(new Buffer(key), 0, length)

    function componentToHex(c) {
    /* http://stackoverflow.com/a/5624139 */
        var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
    }
    length = Math.floor(key.length / 2)
    while (length > 1) {
        color += componentToHex(key.readUIntLE(length - 1, 1))
        //key hash is taken backwards here for ease. still unique.
        length--
    }
    return color
}

Dieting.prototype.update = function ($) {
    io.emit($.param.username, {
        color: this.agents[$.param.username].color,
        drawing: {}
    })
}

Dieting.prototype.list = function ($) {
    $.end(this.templates.list(this.agents))
}

exports.Dieting = Dieting

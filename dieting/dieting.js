var server = require('diet')
var cadence = require('cadence')
var fnv = require('b-tree/benchmark/fnv')
var templater = require('./templates')

function Dieting () {
    this.app = server()
    this.agents = {}
}

Dieting.prototype.init = cadence(function (async, url) {
    var that = this
    this.app.listen(url)
    this.io = require('socket.io')(this.app.server)
    this.app.get('/', function ($) {
        $.redirect('/switchedOn')
    })
    this.app.get('/:title', this.index.bind(this))
    this.app.get('/user/:username', this.newAgent.bind(this))
    this.app.get('/users/', this.list.bind(this))
    this.io.on('connection', function (socket) {
        socket.on('drawing', function (art) {
            socket.broadcast.emit('drawing', art)
        })
    })

    async(function () {
        this.templates = new templater(url)
        this.templates.init(async())
    })
})

Dieting.prototype.index = function ($) {
    $.html(this.templates.home($.params.title))
}

Dieting.prototype.newAgent = function ($) {
    //need to use socket instead
    if (Object.keys(this.agents).indexOf($.params.username) < 0) {
        this.agents[$.params.username] = {
            // need endpoint
            host: $.url.hostname,
            color: this.color($.params.username)
        }
    }
    $.json({ color: this.agents[$.params.username].color })
}

Dieting.prototype.color = function (key) {
    // hash to 0-255
    var color = '#', length = Buffer.byteLength(key), key = fnv(new Buffer(key), 0, length)

    function componentToHex(c) {
    /* http://stackoverflow.com/a/5624139 */
        var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
    }
    length = Math.min(key.length, 6)
    while (length > 1) {
        color += componentToHex(key.readUIntLE(length - 1, 1))
        //key hash is taken backwards here for ease. still unique.
        length--
    }
    return color
}

Dieting.prototype.list = function ($) {
    $.end(this.templates.list(this.agents))
}

exports.Dieting = Dieting

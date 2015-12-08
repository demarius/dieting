require('proof')(2, require('cadence')(prove))

function prove (async, assert) {
    var diet = require('../../index.js')
    var ua = require('vizsla')
    ua = new ua()
    diet = new diet.Dieting()

    async(function () {
        ua.fetch({
        url: 'http://localhost:8000/blah'}, async())
    }, function (body, res) {
        assert(body.toString(), '<title>home: blah</title>', 'set title')
        ua.fetch({
        url: 'http://localhost:8000/user/borkendogschliefenewfipnepw'}, async())
    }, function (body, res) {
        assert(body.toString(), '#a3', 'got hex')
    })
}

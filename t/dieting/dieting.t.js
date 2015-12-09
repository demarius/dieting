require('proof')(2, require('cadence')(prove))

function prove (async, assert) {
    var diet = require('../../dieting/dieting')
    var ua = require('vizsla'), ua = new ua(), diet = new diet.Dieting()

    async(function () {
        diet.init('http://localhost:8000', async())
    }, function () {
        ua.fetch({
        url: 'http://localhost:8000/blah'}, async())
    }, function (body, res) {
        assert(body.toString().indexOf('blah'), 'title set')
        ua.fetch({
        url: 'http://localhost:8000/user/borkendogschliefenewfipnepw'}, async())
    }, function (body, res) {
        assert(body.toString(), '#a3', 'got hex')
        /*
        ua.fetch({
        url: 'http://localhost:8000/users/'}, async())
        */
    })
}

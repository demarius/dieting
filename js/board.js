paper.install(window)
window.onload = function () {
    var canvas = document.getElementById('board')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    paper.setup(canvas)
    var bandits = []
    var path = new paper.Path(), tool = new Tool(), nativeColor
    var socket = io()

    var nativeDraw = function (ev) {
        path.lineTo(ev.point)
        paper.view.draw()
        path.moveTo(ev.point)
        socket.emit('drawing', {
            move: ev.point,
            color: nativeColor
        })
    }

    var banditDraw = function (ev, color) {
        var bandit = bandits[color]
        bandit.lineTo(ev)
        paper.view.draw()
        bandit.moveTo(ev)
    }

    socket.on('drawing', function (art) {
        if (!bandits.hasOwnProperty(art.color))  {
            bandits[art.color] = new Path()
            bandits[art.color].strokeColor = art.color
            bandits[art.color].moveTo(new Point(50, 50))
        }
        banditDraw(new Point(art.move.slice(1)), art.color)
    })

    $('.welcome button').on('click', function () {
        var username = $('.welcome input').val() || 'anon'
        $('.welcome').remove()
        $('body').css('cursor', 'none')
        if (username == 'anon') {
            path.strokeColor = 'black'
            // black, no socket
            path.moveTo(new paper.Point(100, 100))
            bandits['black'] = path
            tool.onMouseMove = function (ev) {
                banditDraw(ev.point, 'black')
            }
        } else {
            $.ajax('/user/' + username, {
                data: {
                    username: username
                },
                success: function (data) {
                    nativeColor = data.color // because vv
                    path.strokeColor = data.color // <- converts to otherness
                    path.moveTo(new paper.Point(50, 50))
                    tool.onMouseMove = nativeDraw
                }
            })
        }
    })
}

paper.install(window)
window.onload = function() {
    var canvas = document.getElementById('board');
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    paper.setup(canvas);
    var path = new paper.Path(), tool = new Tool()
    $.ajax('/user/' + username, {
        data: {
            username: username
        },
        success: function (data) {
            //path.strokeColor = data.whatever
            path.strokeColor = 'black';
            var start = new paper.Point(100, 100);
            path.moveTo(start);
            path.lineTo(start.add([ 200, -50 ]));
            paper.view.draw();
            tool.onMouseMove = function (ev) {
                path.lineTo(ev.point)
                path.moveTo = ev.point
            }
        }
    })
}

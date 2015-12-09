var cadence = require('cadence')
var dieter = require('./dieting/dieting')

dieter = new dieter.Dieting()

dieter.init('http://localhost:8000', function () {console.log(arguments)})

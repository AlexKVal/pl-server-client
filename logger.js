module.exports = function loggerMiddleware(req, res, next) {
  var startTime = +new Date();
  var outStream = process.stdout;

  var requestedUrl = req.url;
  var httpMethod = req.method;

  res.on('finish', function onRequestFinished() {
    var duration = +new Date() - startTime;
    var message = httpMethod + ' to ' + requestedUrl +
      '\ntook ' + duration + ' ms \n\n';
console.log('finish');
    outStream.write(message);
  })

  next();
}

var App = new Backbone.Marionette.Application();



App.on('start', function () {
  Backbone.history.start({pushState: false});
});

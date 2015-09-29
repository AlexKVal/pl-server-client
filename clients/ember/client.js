var App = Ember.Application.create({
  LOG_TRANSITIONS: true
});

App.ApplicationSerializer = DS.JSONSerializer.extend();

App.Todo = DS.Model.extend({
  description: DS.attr('string'),
  // One of ['incomplete', 'complete']
  status: DS.attr('string')
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    var promise = this.store.findAll('todo');

    // -- debug --
    promise.then(function(items) {
      items.forEach(function(item) {
        var msg = 'Item: id=' + item.id + ' ' +
          'desc="' + item.get('description') + '" ' +
          'status="' + item.get('status') + '"';
        console.log(msg);
      })
    })
    // ----------

    return promise;
  }
});

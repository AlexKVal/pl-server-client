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
    return this.store.findAll('todo');
  }
});

App.IndexController = Ember.Controller.extend({
  incomplete: Ember.computed.filterBy('model', 'status', 'incomplete'),
  completed: Ember.computed.filterBy('model', 'status', 'complete'),
  sumIncomplete: Ember.computed.alias('incomplete.length'),
  sumComplete: Ember.computed.alias('completed.length')
});

App.TodoLineComponent = Ember.Component.extend({
  tagName: 'li',
  classNames: ['list-group-item'],
  classNameBindings: ['isComplete::list-group-item-warning'],
  isComplete: Ember.computed('todo.status', function() {
    return this.todo.get('status') === 'complete';
  }),
  completeClass: Ember.computed('isComplete', function() {
    return this.get('isComplete') ? 'complete' : '';
  }),
  // completeClass: function() {
  //   return this.get('isComplete') ? 'complete' : '';
  // }.property('isComplete'),
  actions: {
    removeTodo: function() {
      var todo = this.get('todo');
      console.log(todo.get('description'));
      todo.deleteRecord();
      todo.save();
    },
    toggleDone: function() {
      console.log('toggle done');
    }
  }
});

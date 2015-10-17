var App = Ember.Application.create({
  LOG_TRANSITIONS: true
});

App.ApplicationSerializer = DS.JSONSerializer.extend();

App.Todo = DS.Model.extend({
  description: DS.attr('string'),
  // One of ['incomplete', 'complete']
  status: DS.attr('string'),
  toggleDone: function() {
    this.set('status', (this.get('status') === 'complete') ? 'incomplete' : 'complete');
    return this;
  }
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.findAll('todo');
  }
});

App.IndexController = Ember.Controller.extend({
  todosSortingDesc: ['id:desc'],
  sortedTodosDesc: Ember.computed.sort('model', 'todosSortingDesc'),

  incomplete: Ember.computed.filterBy('model', 'status', 'incomplete'),
  completed: Ember.computed.filterBy('model', 'status', 'complete'),
  sumIncomplete: Ember.computed.alias('incomplete.length'),
  sumComplete: Ember.computed.alias('completed.length'),
  watchAllDone: function() {
    var incompleteItems = this.get('incomplete');
    incompleteItems.setEach('status', 'complete');
    incompleteItems.invoke('save');
  }.observes('allDone'),
  actions: {
    saveNew: function() {
      $('#new-descr').focus();

      var descr = this.get('newDescr').trim();
      if (!descr) return;

      var status = this.get('isCompleted') ? 'complete' : 'incomplete';

      var newTodo = this.store.createRecord('todo', {
        description: this.get('newDescr'),
        status: status
      });
      newTodo.save().then(function() {
        this.set('newDescr', '');
        this.set('isCompleted', false);
      }.bind(this));
    },
    cancelEdit: function() {
      this.set('newDescr', '');
    },
    removeAllDone: function() {
      var completed = this.get('completed');
      completed.invoke('deleteRecord');
      completed.invoke('save');
    }
  }
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
      // var todo = this.get('todo');
      // todo.toggleDone();
      // todo.save();
      this.get('todo').toggleDone().save();
    }
  }
});

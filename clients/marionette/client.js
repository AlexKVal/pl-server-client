var App = new Backbone.Marionette.Application();

App.Models = {};
App.Collections = {};
App.Views = {};

App.Models.TodoItem = Backbone.Model.extend({
  urlRoot: '/todos',
  isComplete: function () {
    return this.get('status') === 'complete';
  },
  toggleStatus: function () {
    this.set({status: this.isComplete() ? 'incomplete' : 'complete'})
    this.save({wait: true});
  }
});

App.Collections.TodoList = Backbone.Collection.extend({
  model: App.Models.TodoItem,
  url: '/todos',

  incompleteItems: function () {
    return this.filter(function(item){ return item.get('status') === 'incomplete' });
  },
  completeItems: function () {
    return this.filter(function(item){ return item.get('status') === 'complete' });
  },
  preloadFromHtml: function () {
    var todosPreloaded = JSON.parse( $('#todos-preloaded').html() );
    this.reset(todosPreloaded);
  }
});

App.Views.NewItemFormView = Marionette.ItemView.extend({
  el: 'form',
  template: false,
  ui: {
    description: 'input[name=description]',
    status: 'input[name=status]'
  },
  events: {
    submit: 'onSubmit'
  },
  initialize: function () {
    this.progressBar = this.$el.next();
  },
  onSubmit: function (event) {
    event.preventDefault();

    var newTodoItem = new App.Models.TodoItem({
      description: this.ui.description.val(),
      status: this.ui.status[0].checked ? 'complete' : 'incomplete'
    });

    this.progressBar.show();
    newTodoItem.save({wait: true}).done(_.bind(function(savedItem) {
      this.collection.add(savedItem);
      this.progressBar.hide();
    }, this));
    this.$el.trigger('reset');
  }
});


App.on('start', function () {
  this.todoList = new App.Collections.TodoList();

  //

  this.todoList.preloadFromHtml();
  this.todoList.fetch();

  var newFormView = new App.Views.NewItemFormView({collection: this.todoList});
  newFormView.render();

  Backbone.history.start({pushState: false});
});

App.start();

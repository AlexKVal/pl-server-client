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

App.Views.Summaries = Marionette.ItemView.extend({
  el: '#summaries',
  template: false,
  ui: {
    incomplete: '.incomplete > .label-info',
    complete: '.done > .label-info',
    allDone: '.toggle-all-done',
    removeDone: '.remove-done'
  },
  events: {
    'click @ui.allDone': 'toggleAllDone',
    'click @ui.removeDone': 'removeDone'
  },
  collectionEvents: {
    'all': 'render'
  },
  toggleAllDone: function () {
    var newStatus = this.ui.allDone[0].checked ? 'complete' : 'incomplete';
    console.log('done:', newStatus);
    this.collection.forEach(function (item) {
      item.save({status: newStatus});
    })
  },
  removeDone: function () {
    this.collection.completeItems().forEach(function (item) {
      item.destroy();
    })
  },
  onRender: function () {
    this.ui.incomplete.text(this.collection.incompleteItems().length)

    var completeLength = this.collection.completeItems().length;
    this.ui.complete.text(completeLength)
    this.ui.removeDone.toggleClass('hidden', !completeLength);
  }
});

App.Views.NewItemForm = Marionette.ItemView.extend({
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

    this.progressBar.show();
    this.collection.create({
      description: this.ui.description.val(),
      status: this.ui.status[0].checked ? 'complete' : 'incomplete'
    },
    {
      wait: true,
      success: _.bind(function() {
        this.progressBar.hide();
      }, this)
    });
    this.$el.trigger('reset');
  }
});


App.on('start', function () {
  this.todoList = new App.Collections.TodoList();

  //

  this.todoList.preloadFromHtml();
  this.todoList.fetch();

  var summariesView = new App.Views.Summaries({collection: this.todoList});
  summariesView.render();
  var newFormView = new App.Views.NewItemForm({collection: this.todoList});
  newFormView.render();

  Backbone.history.start({pushState: false});
});

App.start();

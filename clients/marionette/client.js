var socket = io();

var App = {
  Models: {},
  Collections: {},
  Views: {},
  Layout: {}
};

Marionette.TemplateCache.prototype.compileTemplate = function (rawTemplate) {
  Mustache.parse(rawTemplate);
  return _.partial(Mustache.render, rawTemplate);
};

App.Layout.Root = Marionette.LayoutView.extend({
  el: '#app',
  regions: {
    todos: '#todos'
  }
});

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
  comparator: function(todo) {
    return - todo.get('id'); // reverse order
  },
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
    this.collection.each(function (item) {
      item.save({status: newStatus});
    })
  },
  removeDone: function () {
    // REST way
    // this.collection.completeItems().forEach(function (item) {
    //   item.destroy();
    // })

    // custom implementation
    var completeIDs = _.pluck( this.collection.completeItems(), 'id' ).join(',');

    $.ajax({
      url: '/todos/packet/' + completeIDs,
      method: 'DELETE'
    });
  },
  onRender: function () {
    this.ui.incomplete.text(this.collection.incompleteItems().length)

    var completeLength = this.collection.completeItems().length;
    this.ui.complete.text(completeLength)
    this.ui.removeDone.toggleClass('hidden', !completeLength);
  }
});

App.Views.NewItemForm = Marionette.ItemView.extend({
  el: '#new-form',
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

App.Views.TodoView = Marionette.ItemView.extend({
  tagName: 'li',
  className: 'list-group-item',
  template: '#todo-item-template',
  events: {
    'click a[data-done-id]': 'doneHandler',
    'click a[data-del-id]': 'removeHandler',
    'click div.view': 'editingModeOn',
    'blur .edit': 'editingModeOff',
    'keyup .edit': 'onKeyUp'
  },
  ui: {
    input: '.edit'
  },
  modelEvents: {
    'request': 'onModelRequest',
    'sync': 'onModelSync',
    'change': 'onModelChange'
  },

  // DOM events
  doneHandler: function (event) {
    event.preventDefault();
    event.stopPropagation();

    this.model.toggleStatus();
  },
  removeHandler: function (event) {
    event.preventDefault();
    event.stopPropagation();

    this.removeItem();
  },
  onKeyUp: function(e) {
    // end editing on Enter
    if (e.which === 13) this.endEditingMode();
    // cancel editing via 'Esc'
    if (e.which === 27) this.editingModeOff();
  },

  // Model events
  onModelRequest: function () {
    this.$el.addClass('loading');
  },
  onModelSync: function () {
    this.$el.removeClass('loading');
  },
  onModelChange: function() {
    this.render();
  },

  editingModeOn: function () {
    this.$el.toggleClass('editing');
    // always reset for Esc handling
    this.ui.input.val(this.model.get('description'));
    this.ui.input.focus();
  },
  editingModeOff: function () {
    this.$el.removeClass('editing');
  },
  endEditingMode: function () {
    this.editingModeOff();

    // check for empty model and save
    var description = this.ui.input.val();
    if (!description) this.removeItem();
    else this.model.save({description: description}, {wait: true});
  },

  removeItem: function () {
    this.$el.addClass('loading').slideUp('slow', _.bind(function() {
      this.model.destroy();
    }, this));
  },
  templateHelpers: function () {
    return {
      done: this.model.isComplete()
    };
  },
  onDomRefresh: function () {
    this.$el.effect('highlight');
  },
  onRender: function() {
    this.$el.toggleClass('list-group-item-warning', !this.model.isComplete());
  }
});

App.Views.TodoListView = Marionette.CollectionView.extend({
  childView: App.Views.TodoView
});

App.start = function() {
  App.firstLoad = true;
  this.todoList = new App.Collections.TodoList();
  this.todoList.preloadFromHtml();

  var summariesView = new App.Views.Summaries({collection: this.todoList});
  summariesView.render();

  var newFormView = new App.Views.NewItemForm({collection: this.todoList});
  newFormView.render();

  this.root = new App.Layout.Root();

  var listItemsView = new App.Views.TodoListView({
    collection: this.todoList
  });
  this.root.showChildView('todos', listItemsView);

  this.todoList.fetch();

  var that = this;
  socket.on('server-list-updated', function() {
    console.log('on server-list-updated: fetch()');
    that.todoList.fetch();
  });
  socket.on('connect', function() {
    if (!App.firstLoad) {
      console.log('on reconnect: trigger re-render-all');
      that.todoList.fetch();
    } else {
      console.log('on connect');
      App.firstLoad = false;
    }
  });

  Backbone.history.start({pushState: false});
};

App.start();

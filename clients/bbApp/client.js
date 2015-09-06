var App = {
  Models: {},
  Collections: {},
  Views: {}
}

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

App.Views.TodoView = Backbone.View.extend({
  tagName: 'li',
  className: 'list-group-item',
  template: $('#todo-item-template').html(),

  events: {
    'click a[data-done-id]': 'doneHandler',
    'click a[data-del-id]': 'removeHandler',
    'click div.view': 'editHandler',
    'blur .edit': 'cancelEditingMode',
    'keyup .edit': 'onKeyUp'
  },

  initialize: function () {
    this.listenTo(this.model, 'sync', this.onModelSync);
    this.listenTo(this.model, 'destroy', this.onModelRemove);
  },

  // DOM events
  doneHandler: function (event) {
    event.preventDefault();
    event.stopPropagation();

    this.$el.addClass('loading');
    this.model.toggleStatus();
  },
  removeHandler: function (event) {
    event.preventDefault();
    event.stopPropagation();

    this.$el.addClass('loading');
    this.model.destroy({wait: true});
  },
  editHandler: function (event) {
    this.switchIntoEditingMode();
  },
  onKeyUp: function(e) {
    // end editing on Enter
    if (e.keyCode === 13) this.endEditingMode();
    // cancel editing via 'Esc'
    if (e.keyCode === 27) this.cancelEditingMode();
  },

  // Model events
  onModelSync: function () {
    this.$el.removeClass('loading');
    this.render();
    this.$el.effect('highlight');
  },
  onModelRemove: function () {
    this.$el.slideUp(function() {
      this.remove();
    });
  },

  switchIntoEditingMode: function () {
    this.$el.toggleClass('editing');
    // always reset for Esc handling
    this.input.val(this.model.get('description'));
    this.input.focus();
  },
  cancelEditingMode: function () {
    this.$el.removeClass('editing');
  },
  endEditingMode: function () {
    this.$el.removeClass('editing');
    // check for empty model and save
    var description = this.input.val();

    this.$el.addClass('loading');
    if (!description) {
      this.model.destroy({wait: true});
    } else {
      this.model.save({description: description}, {wait: true});
    }
  },

  render: function() {
    this.$el.toggleClass('list-group-item-warning', !this.model.isComplete());

    var view = $.extend({done: this.model.isComplete()}, this.model.attributes);
    this.$el.html( Mustache.render(this.template, view) );
    this.input = this.$('.edit');

    return this
  }
});

App.Views.TodoListView = Backbone.View.extend({
  el: '#todos',
  initialize: function () {
    this.collection.on('add', this.addItem, this);
    this.collection.on('reset', this.addAll, this);
    this.$el.empty(); // remove 'loading...'
  },
  addItem: function (todoItem) {
    var todoView = new App.Views.TodoView({model: todoItem});
    $(todoView.render().el).hide().prependTo(this.$el).slideDown();
  },
  addAll: function (collection) {
    console.log('reset: ', this.collection);
    this.collection.forEach(this.addItem, this);
  }
})

App.Views.NewItemFormView = Backbone.View.extend({
  el: 'form',
  events: {
    submit: 'onSubmit'
  },

  initialize: function () {
    this.onNewItemSave = this.onNewItemSave.bind(this);
    // this.progressBar = this.$el.parent().children('.progress');
    this.progressBar = this.$el.next();
  },
  onNewItemSave: function (savedItem) {
    this.model.add(savedItem);
    this.progressBar.hide();
  },
  onSubmit: function (event) {
    event.preventDefault();

    var newTodoItem = new App.Models.TodoItem({
      description: this.$('input[name=description]').val(),
      status: this.$('input[name=status]')[0].checked ? 'complete' : 'incomplete'
    });

    this.progressBar.show();
    newTodoItem.save().done(this.onNewItemSave);

    this.$el.trigger('reset');
  }
});

App.Views.Summaries = Backbone.View.extend({
  el: '#summaries',
  events: {
    'click .toggle-all-done': 'toggleAllDone',
    'click .remove-done': 'removeDone'
  },
  initialize: function () {
    this.incomplete = this.$('.incomplete').find('.label-info');
    this.complete = this.$('.done').find('.label-info');
    this.allDone = this.$('.toggle-all-done')[0];
    this.removeDone = this.$('.remove-done');
    this.listenTo(this.collection, 'all', this.render);
    this.render();
  },
  toggleAllDone: function () {
    var newStatus = this.allDone.checked ? 'complete' : 'incomplete';
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
  render: function () {
    this.incomplete.text(this.collection.incompleteItems().length)

    var completeLength = this.collection.completeItems().length;
    this.complete.text(completeLength)
    this.removeDone.toggleClass('hidden', !completeLength);
  }
});

App.TodoRouter = Backbone.Router.extend({
  routes: {
    '': 'index',
    '*path': 'notFound'
  },
  initialize: function () {
    this.todoList = new App.Collections.TodoList();
    new App.Views.TodoListView({collection: this.todoList});

    this.todoList.preloadFromHtml();

    new App.Views.NewItemFormView({model: this.todoList});
    new App.Views.Summaries({collection: this.todoList});
  },
  index: function () {
    console.log('index');
    this.todoList.fetch();
  },
  notFound: function () {
    console.log('404 Nothing is here');
  }
});

$(function() {
  App.router = new App.TodoRouter();
  Backbone.history.start({pushState: false});
});

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
    this.save();
  }
});

App.Collections.TodoList = Backbone.Collection.extend({
  model: App.Models.TodoItem,
  url: '/todos'
});

App.Views.TodoView = Backbone.View.extend({
  tagName: 'li',
  className: 'list-group-item',
  template: _.template( $('#todo-item-template').html() ),

  events: {
    'click a[data-done-id]': 'doneHandler',
    'click a[data-del-id]': 'removeHandler',
    'click a.description': 'editHandler',
    'keyup .edit': 'onKeyUp'
  },

  initialize: function () {
    this.listenTo(this.model, 'change', this.onModelChanged);
    this.listenTo(this.model, 'destroy', this.onModelRemove);
  },

  // DOM events
  doneHandler: function (event) {
    event.preventDefault();
    this.model.toggleStatus();
  },
  removeHandler: function (event) {
    event.preventDefault();
    this.$el.effect('highlight');
    this.model.destroy({wait: true});
  },
  editHandler: function (event) {
    event.preventDefault();
    this.switchIntoEditingMode();
  },
  onKeyUp: function(e) {
    // end editing on Enter
    if (e.keyCode === 13) this.endEditingMode();
    // cancel editing via 'Esc'
    if (e.keyCode == 27) this.$el.removeClass('editing');
  },

  // Model events
  onModelChanged: function () {
    console.log('onModelChanged');
    this.render();
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
  endEditingMode: function () {
    this.$el.removeClass('editing');
    // check for empty model and save
    var description = this.input.val();
    if (!description) {
      this.model.destroy();
    } else {
      this.model.save({description: description});
    }
  },

  render: function() {
    this.$el.toggleClass('list-group-item-warning', !this.model.isComplete());

    this.$el.html(this.template(this.model.attributes))
    this.input = this.$('.edit');

    return this
  }
});

App.Views.TodoListView = Backbone.View.extend({
  initialize: function () {
    this.collection.on('add', this.addItemSlideDown, this)
  },
  addItemSlideDown: function (todoItem) {
    this.addItem(todoItem).slideDown();
  },
  addItem: function (todoItem) {
    var todoView = new App.Views.TodoView({model: todoItem})
    var newEl = todoView.render().el;
    var $newEl = $(newEl).hide();
    this.$el.prepend(newEl);
    return $newEl;
  },
  addAll: function () {
    this.collection.forEach(this.addItem, this);
  },
  render: function () {
    this.addAll();
    return this;
  }
})

App.Views.NewItemFormView = Backbone.View.extend({
  el: 'form',
  events: {
    submit: 'onSubmit'
  },

  initialize: function () {
    this.onNewItemSave = this.onNewItemSave.bind(this);
  },
  onNewItemSave: function (savedItem) {
    this.model.add(savedItem);
  },
  onSubmit: function (event) {
    event.preventDefault();

    var newTodoItem = new App.Models.TodoItem({
      description: this.$('input[name=description]').val(),
      status: this.$('input[name=status]')[0].checked ? 'complete' : 'incomplete'
    });
    newTodoItem.save().done(this.onNewItemSave);

    this.$el.trigger('reset');
  }
});

App.TodoRouter = Backbone.Router.extend({
  routes: {
    '': 'index',
    'todos/:id(/)': 'show',
    '*path': 'notFound'
  },
  initialize: function () {
    this.todoList = new App.Collections.TodoList();
    this.todosView = new App.Views.TodoListView({collection: this.todoList});
    $('#todos').html(this.todosView.render().el);

    new App.Views.NewItemFormView({model: this.todoList});
  },
  index: function () {
    console.log('index');
    this.todoList.fetch();
  },
  show: function (id) {
    console.log('show: ', id);
  },
  notFound: function () {
    console.log('404 Nothing here');
  }
});

$(function() {
  App.router = new App.TodoRouter();
  Backbone.history.start({pushState: false});
});

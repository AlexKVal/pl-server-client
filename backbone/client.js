(function(_, $, Backbone) {

var TodoItem = Backbone.Model.extend({
  urlRoot: '/todos',
  isComplete: function () {
    return this.get('status') === 'complete';
  },
  toggleStatus: function () {
    if (this.get('status') === 'incomplete') {
      this.set({status: 'complete'})
    } else {
      this.set({status: 'incomplete'})
    }

    console.log('save model:', this.attributes);
    this.save();
  }
});

var TodoList = Backbone.Collection.extend({
  model: TodoItem,
  url: '/todos'
});

var TodoView = Backbone.View.extend({
  tagName: 'li',
  className: 'list-group-item',
  template: _.template( $('#todo-item-template').html() ),

  events: {
    'click a[data-done-id]': 'doneHandler',
    'click a[data-del-id]': 'removeHandler'
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

  // Model events
  onModelChanged: function () {
    this.render();
    this.$el.effect('highlight');
  },
  onModelRemove: function () {
    this.$el.slideUp();
  },


  render: function() {
    if (!this.model.isComplete()) {
      this.$el.addClass('list-group-item-warning')
    } else {
      this.$el.removeClass('list-group-item-warning')
    }

    this.$el.html(this.template(this.model.attributes))
    return this
  }
});

var TodoListView = Backbone.View.extend({
  initialize: function () {
    this.collection.on('add', this.addItemSlideDown, this)
  },
  addItemSlideDown: function (todoItem) {
    this.addItem(todoItem).slideDown();
  },
  addItem: function (todoItem) {
    var todoView = new TodoView({model: todoItem})
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

var FormView = Backbone.View.extend({
  el: 'form',
  events: {
    submit: 'submitHandler'
  },

  initialize: function () {
    this.onNewItemSave = this.onNewItemSave.bind(this);
  },
  onNewItemSave: function (savedItem) {
    this.model.add(savedItem);
  },
  submitHandler: function (event) {
    event.preventDefault();

    var newTodoItem = new TodoItem({
      description: this.$('input[name=description]').val(),
      status: this.$('input[name=status]').prop('checked') ? 'complete' : 'incomplete'
    });
    newTodoItem.save().done(this.onNewItemSave);

    this.$el.trigger('reset');
  }
});

// App
var TodoRouter = Backbone.Router.extend({
  routes: {
    '': 'index',
    'todos/:id(/)': 'show',
    '*path': 'notFound'
  },
  initialize: function () {
    this.todoList = new TodoList();
    this.todosView = new TodoListView({collection: this.todoList});
    $('#todos').html(this.todosView.render().el);

    new FormView({model: this.todoList});
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
})

var TodoApp = new TodoRouter();
Backbone.history.start({pushState: false});

})(_, jQuery, Backbone);

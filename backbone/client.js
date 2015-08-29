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
    this.$el.effect('highlight', {}, 200);
    this.model.destroy({wait: true});
  },

  // Model events
  onModelChanged: function (model, options) {
    this.render();
    if (!options.notHighlight) this.$el.effect('highlight', {}, 1000);
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
    this.collection.on('add', this.addItem, this)
    // this.collection.on('reset', this.addAll, this)
  },
  addItem: function (todoItem) {
    var todoView = new TodoView({model: todoItem})
    this.$el.prepend(todoView.render().el)
  },
  addAll: function () {
    this.collection.forEach(this.addItem, this)
  },
  render: function () {
    this.addAll();
    return this;
  }
})

var TodoList = Backbone.Collection.extend({
  model: TodoItem,
  url: '/todos'
});

// App
var TodoRouter = Backbone.Router.extend({
  routes: {
    '': 'index'
  },
  initialize: function () {
    this.todoList = new TodoList();
    this.todoList.fetch();
    this.todosView = new TodoListView({collection: this.todoList});
    $('#todos').html(this.todosView.render().el);
  }
})

var TodoApp = new TodoRouter();
Backbone.history.start({pushState: true});

})(_, jQuery, Backbone);

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

  initialize: function () {
    this.listenTo(this.model, 'change', this.changeModel);
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'hide', this.remove);
  },
  changeModel: function (model, options) {
    this.render();
    if (!options.notHighlight) this.$el.effect('highlight', {}, 1000);
  },
  render: function() {
    if (!this.model.isComplete()) {
      this.$el.addClass('list-group-item-warning')
    }

    this.$el.html(this.template(this.model.attributes))
    return this
  },
  remove: function () {
    this.$el.remove();
  }
});

var TodoListView = Backbone.View.extend({
  initialize: function () {
    this.collection.on('add', this.addItem, this)
    // this.collection.on('reset', this.addAll, this)
  },
  addItem: function (todoItem) {
    var todoView = new TodoView({model: todoItem})
    this.$el.append(todoView.render().el)
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
  initialize: function () {
    this.on('remove', this.hideModel)
  },
  hideModel: function (model) {
    model.trigger('hide')
  },
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

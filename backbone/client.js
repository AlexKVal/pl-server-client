$(function() {

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
    console.log('onModelChanged');
    this.render();
  },
  onModelRemove: function () {
    this.$el.slideUp(function() {
      this.remove();
    });
  },


  render: function() {
    this.$el.toggleClass('list-group-item-warning', this.model.isComplete());

    this.$el.attr("data-id", this.model.id);

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

var NewItemFormView = Backbone.View.extend({
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

    var newTodoItem = new TodoItem({
      description: this.$('input[name=description]').val(),
      status: this.$('input[name=status]')[0].checked ? 'complete' : 'incomplete'
    });
    newTodoItem.save().done(this.onNewItemSave);

    this.$el.trigger('reset');
  }
});

var EditFormView = Backbone.View.extend({
  template: _.template( $('#edit-form').html() ),
  events: {
    submit: 'onSubmit'
  },
  onSubmit: function (event) {
    event.preventDefault();
    console.log('submit edited');

    console.log('edit form: this ', this);

    var newData = {
      description: this.$('input[name=description]').val(),
      status: this.$('input[name=status]')[0].checked ? 'complete' : 'incomplete'
    };
    console.log('newData: ', newData);

    this.$el.html( this.savedListItem );

    this.model.save(newData, {
      success: function () {
        window.TodoApp.navigate('/', {trigger: true});
      }
    });
  },
  render: function() {
    this.savedListItem = this.$('.list-item').detach();
    console.log('render edit form: model ', this.model.attributes);
    var editForm = this.template(this.model.attributes);
    this.$el.html( editForm );
    this.$('input[name=description]').focus();

    return this;
  }
});

// App
var TodoRouter = Backbone.Router.extend({
  routes: {
    '': 'index',
    'todos/:id(/)': 'show',
    'todos/:id/edit': 'edit',
    '*path': 'notFound'
  },
  initialize: function () {
    this.todoList = new TodoList();
    this.todosView = new TodoListView({collection: this.todoList});
    $('#todos').html(this.todosView.render().el);

    new NewItemFormView({model: this.todoList});
  },
  index: function () {
    console.log('index');
    this.todoList.fetch();
  },
  show: function (id) {
    console.log('show: ', id);
  },
  edit: function (id) {
    console.log('edit route: ', id);

    var model = this.todoList.get(id);
    console.log('edit model: ', model.attributes);

    new EditFormView({
      el: $('li[data-id=' + id + ']'),
      model: model
    }).render();
  },
  notFound: function () {
    console.log('404 Nothing here');
  }
})

window.TodoApp = new TodoRouter();
Backbone.history.start({pushState: false});

});

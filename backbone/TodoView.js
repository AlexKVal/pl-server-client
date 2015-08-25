// var Backbone = require('backbone');
(function(_, $, Backbone) {

var TodoItem = Backbone.Model.extend({
  toggleStatus: function () {
    if (this.get('status') === 'incomplete') {
      this.set({status: 'complete'})
    } else {
      this.set({status: 'incomplete'})
    }

    console.log('save model:', this.attributes);
    // this.save(); // PUT /todos/1
  }
});

var TodoView = Backbone.View.extend({
  // el: '#todo-view',
  // tagName: 'article',
  // id: 'todo-view',
  className: 'todo',

  // template: _.template('<h3><%= description %></h3>'),

  // template: _.template('<h3 class="<%= status %>">' +
  //   '<input type=checkbox ' +
  //   '<% if (status === "complete") print("checked") %>/>' +
  //   '<%= description %></h3>'),

  template: _.template( $('#todo-view-template').html() ),

  events: {
    'click h3': 'handleH3Click',
    'change input': 'toggleStatus'
  },
  handleH3Click: function (e) {
    console.log('H3 has been clicked');
  },
  toggleStatus: function () {
    this.model.toggleStatus();
  },
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
    // $(this.el).html('<h3>' + this.model.get('description') + '</h3>');
    // $(this.el).text(this.model.get('description'));
    // this.$el.html('<h3>' + this.model.get('description') + '</h3>')

    // var attributes = this.model.toJSON()
    // this.$el.html(this.template(attributes))

    this.$el.html(this.template(this.model.attributes))
    return this
  },
  remove: function () {
    this.$el.remove();
  }
});

var TodoListView = Backbone.View.extend({
  // el: '#todo-view',
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
  // url: '/todos'
});

// App
var TodoRouter = Backbone.Router.extend({
  routes: {
    '': 'index',
    'todos': 'index',
    'todos/:id': 'show'
  },
  initialize: function () {
    window.todoList = this.todoList = new TodoList();

    this.todoList.reset([
      {id: 1, description: 'Pick up milk.', status: 'incomplete'},
      {id: 2, description: 'Get a car wash', status: 'incomplete'},
      {id: 3, description: 'Learn Backbone.', status: 'incomplete'}
    ]);
    this.todosView = new TodoListView({collection: this.todoList});
    $('#app').append(this.todosView.render().el);
  },
  start: function () {
    Backbone.history.start()//{pushState: true});
  },
  index: function () {
    console.log('go to Index');
    // this.todoList.fetch();

  },
  show: function (id) {
    console.log('show #', id);
    // this.todoList.focusOnTodoItem(id);
  }
})

var TodoApp = new TodoRouter();
TodoApp.start();

TodoApp.navigate('todos', {trigger: true});






// // Router playground
// var App = new (Backbone.Router.extend({
//   routes: {
//     '': 'index',
//     '*path': 'notFound',
//     'search/:what(/:optional)': 'search'
//   },
//   initialize: function () {
//     this.route(/^page\/(\d+)$/, 'page');
//   },
//   index: function () {
//     console.log('index route');
//   },
//   notFound: function () {
//     console.log('Sorry there is nothing here. Wrong URL');
//   },
//   search: function (what, optional) {
//     console.log('search ' + what);
//     if (optional) console.log('optional: ' + optional);
//   },
//   page: function (id) {
//     console.log('page id = ' + id);
//   }
// }));
//
// Backbone.history.start({pushState: true});
//
// App.navigate('', {trigger: true})
// // App.navigate('search/something', {trigger: true})
// // App.navigate('search/some/gg', {trigger: true})
// // App.navigate('search/SPACES/hello%20world', {trigger: true})
// App.navigate('page/2', {trigger: true})
// App.navigate('page/SPACES', {trigger: true})
// App.navigate('', {trigger: true})




})(_, jQuery, Backbone);

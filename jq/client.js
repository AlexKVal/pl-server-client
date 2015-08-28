$(function() {
  $.get('/todos', renderList);

  var todoListTemplate = $('#todoList').html();
  Mustache.parse(todoListTemplate); // cache

  var todoItemTemplate = $('#todoItem').html();
  Mustache.parse(todoItemTemplate); // cache

  function renderList(todos) {
    var view = {
      todos: todos.reverse(),
      isDone: function () {
        return this.status === 'complete' ? 'done' : ''
      },
      liClass: function () {
        return this.status === 'incomplete' ? 'list-group-item-warning' : ''
      }
    };

    var listItems = Mustache.render(todoListTemplate, view);

    $('#todos').html(listItems);
  }

  // form
  $('form').on('submit', function (event) {
    event.preventDefault();
    var form = $(this);

    var desc = form.find('input[name="description"]').val();
    if (!desc) return;

    $.ajax({
      url: '/todos',
      type: 'POST',
      data: form.serialize()
    })
    .done(function (newTodoItem) {
      newTodoItem.isDone = function () {
        return this.status === 'complete' ? 'done' : ''
      }
      newTodoItem.liClass = function () {
        return this.status === 'incomplete' ? 'list-group-item-warning' : ''
      }
      var liItem = Mustache.render(todoItemTemplate, newTodoItem);
      $('#todos').prepend(liItem);
      form.trigger('reset');
    })
  })

  // Delete
  $('#todos').on('click', 'a[data-id]', function (event) {
    event.preventDefault();

    var target = $(event.currentTarget);
    var itemId = target.data('id');

    console.log('delete ', itemId);

    $.ajax({
      type: 'DELETE',
      url: '/todos/' + itemId
    })
    .done(function () {
      target.parents('li').remove();
    })
  })
});

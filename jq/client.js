$(function() {
  $.get('/todos', renderList);

  function renderList(todos) {
    var todoItemTemplate = $('#todoItem').html();
    Mustache.parse(todoItemTemplate); // cache

    var view = {
      todos: todos.reverse(),
      isDone: function () {
        return this.status === 'complete' ? 'done' : ''
      },
      liClass: function () {
        return this.status === 'incomplete' ? 'list-group-item-warning' : ''
      }
    };

    var listItems = Mustache.render(todoItemTemplate, view);

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
      renderList([newTodoItem]);
      form.trigger('reset');
    })
  })
});

$(function() {
  $.get('/todos', renderList);

  function renderList(todos) {
    var todoItemTemplate = $('#todoItem').html();
    Mustache.parse(todoItemTemplate); // cache

    var listItems = todos.reverse().map(function (todo) {
      var isComplete = todo.status === 'complete';

      todo.desc = function () {
        return isComplete ? '<del>' + todo.description + '</del>' : todo.description
      }

      todo.liClass = function () {
        return 'list-group-item' + (isComplete ? '' : ' list-group-item-warning')
      }

      return Mustache.render(todoItemTemplate, todo);
    });

    $('#todos').prepend(listItems);
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

$(function() {
  $.get('/todos', appendToList);

  function appendToList(todos) {
    var listItems = todos.reverse().map(function (todo) {
      var isComplete = todo.status === 'complete';

      var badge = '<span class="badge pull-left">' + todo.id + '</span>';

      var descr;
      if (isComplete) {
        descr = '<del>' + todo.description + '</del>';
      } else {
        descr = todo.description;
      }

      var itemAnchor = '<a href="/todos/' + todo.id + '" class="cursive">' + descr + '</a>';

      var deleteButton = '<a href="#" class="btn btn-info btn-sm pull-right"><span class="glyphicon glyphicon-remove"></span></a>'

      return $('<li>', {
        html: badge + '&nbsp;&nbsp;' + itemAnchor + deleteButton,
        class: 'list-group-item' + (isComplete ? '' : ' list-group-item-warning')
      })
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
      appendToList([newTodoItem]);
      form.trigger('reset');
    })
  })
});

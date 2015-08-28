$(function() {
  $.get('/todos', appendToList);

  function appendToList(todos) {
    var listItems = todos.reverse().map(function (todo) {
      // return $('<li>', {text: todo.description, class: 'list-group-item'})
      // var content = '<a href="/todos/' + todo.id + '">' +
      // todo.description + '</a>' +
      // '<span class="badge">' + todo.id + '</span>'

      var isComplete = todo.status === 'complete';

      var descr = todo.description;
      if (isComplete) descr = '<del>' + descr + '</del>';

      var badge = '<span class="badge">' + todo.id + '</span>';

      return $('<a>', {
        href: '/todos/'+todo.id,
        html: descr + badge,
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

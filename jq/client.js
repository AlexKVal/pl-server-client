$(function() {
  $.get('/todos', appendToList);

  function appendToList(todos) {
    var listItems = todos.map(function (todo) {
      // return $('<li>', {text: todo.description, class: 'list-group-item'})
      // var content = '<a href="/todos/' + todo.id + '">' +
      // todo.description + '</a>' +
      // '<span class="badge">' + todo.id + '</span>'

      var content = todo.description + ' <span class="badge">' + todo.id + '</span>'

      return $('<a>', {
        href: '/todos/'+todo.id,
        html: content,
        class: 'list-group-item'
      })
    });
    $('#todos').append(listItems);
  }

  // form
  $('form').on('submit', function (event) {
    event.preventDefault();
    var form = $(this);
    var newTodoData = form.serialize();

    $.ajax({
      url: '/todos',
      type: 'POST',
      data: newTodoData
    })
    .done(function (newTodoItem) {
      appendToList([newTodoItem]);
      form.trigger('reset');
    })
  })
});

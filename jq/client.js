$(function() {
  $.get('/todos', appendToList);

  function appendToList(todos) {
    var listItems = todos.map(function (todo) {
      return $('<li>', {text: todo.description, class: 'list-group-item'})
    });
    $('#todos').append(listItems);
  }
});

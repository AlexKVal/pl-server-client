# playground

TODO:
- migrate to Mustache templates
- migrate to the `var App = {}` structure with namespacing
- use bootstrap data with page sended
- add localStorage (write custom Model.sync)
- use http://documentup.com/jeromegn/backbone.localStorage
- then compare with http://localtodos.com/

- Express
  - Morgan
- jQuery
  - Mustache
- Backbone

```
> npm i express nodemon morgan body-parser lodash
> nodemon --watch server.js --watch routes/todos.js server.js
```
- open http://localhost:3000/js/
- open http://localhost:3000/b/

Use `HTTPie` (`brew install httpie`) for REST API testing.
```
> http localhost:3000/todos
```

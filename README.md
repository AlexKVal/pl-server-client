# playground

TODO:
- ~~migrate to the `var App = {}` structure with namespacing~~
- remove model if edit field is empty
- migrate to Mustache templates
- rewrite editing logic with CSS help

Maybe:
- use bootstrap data with page sended
- add localStorage (write custom Model.sync)
- use http://documentup.com/jeromegn/backbone.localStorage

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

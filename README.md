# Examples of technologies usage

## Technologies

- Express
  - Morgan
  - routes
- jQuery
  - Mustache
- Backbone
  - Mustache (was Underscore)
  - routes

```
> git clone && cd
> npm install
> npm start
```
- `npm run jquery` opens `http://localhost:3000/jq/`
- `npm run backbone` opens `http://localhost:3000/b/`

Use `HTTPie` (`brew install httpie`) for REST API testing.
```
> http localhost:3000/todos
```

#### TODO:
- ~~migrate to the `var App = {}` structure with namespacing~~
- ~~remove model if edit field is empty~~
- ~~rewrite editing logic with CSS help~~
- ~~make click on LI switches to edit mode~~
- ~~realize~~
  ~~beforeSend: function() { $('.confirmation').addClass('is-loading'); },~~
  ~~complete: function() { $('.confirmation').removeClass('is-loading'); }~~
- ~~show summaries (under 'new' form)~~
- ~~add button `mark all as done`~~
- ~~add button `remove all that are done`~~
- make top form fixed and the list of items - scrolling

Maybe:
- ~~use package.json for `npm i` and `npm start`~~
- ~~migrate to Mustache templates~~
- ~~use preloaded (with index page) data (preloads only `incomplete`)~~
- realize with other style frameworks:
  - https://fezvrasta.github.io/bootstrap-material-design/
  - http://getskeleton.com/
  - http://www.getmdl.io/
- add 'Canvas'

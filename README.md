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
- Marionette
- Ember

```
> git clone && cd
> npm install
> npm start
```
- `npm run jquery` opens `http://localhost:3000/jq/`
- `npm run backbone` opens `http://localhost:3000/b/`
- `npm run marionette` opens `http://localhost:3000/m/`

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
- ~~create Marionette version of client~~
  - ~~new item form~~
  - ~~summaries~~
  - ~~add TodoView~~
  - ~~add TodoListView~~
- ~~refactor to use `serializeData()` in Marionette client (templateHelper was used instead)~~
- ~~template caching~~
- ~~implement socket.io~~
  - ~~mass operations broadcasting (All done, Remove all done)~~
  - ~~update on connection restoring~~
    - ~~remove double 'GET /todos'~~
  - ~~refactor all the socket.io layer code~~
  - ~~fix bug with 'add' after 'delete' (sometimes do not render)~~
  - move `server's io.emit` into server.data layer (when implemented)
- ~~when there are many items - takes long time. Optimize.~~
  - ~~All done~~
  - ~~Remove done items~~
- ~~add li:hover highlighting to indicate that it is 'editable'~~
- ~~implement socket.io for Marionette client~~
- ~~Marionette: Optimize~~
  - ~~All done~~
  - ~~Remove done items~~
- ~~use jade Layouts~~
- Ember:
  - http://guides.emberjs.com/v2.1.0/object-model/computed-properties-and-aggregate-data/
  - improve 'allDone' handler. make it 'bulk' operation.
  - ~~when saving empty todo-item - then delete it~~

Maybe:
- make top form fixed and the list of items - scrolling
- ~~use package.json for `npm i` and `npm start`~~
- ~~migrate to Mustache templates~~
- ~~use preloaded (with index page) data (preloads only `incomplete`)~~
- realize with other style frameworks:
  - http://semantic-ui.com/
  - https://fezvrasta.github.io/bootstrap-material-design/
  - http://getskeleton.com/
  - http://www.getmdl.io/
- add 'Canvas'
- https://daneden.github.io/animate.css/
- implement CSRF https://github.com/krakenjs/lusca#luscacsrfoptions
- implement CSP https://github.com/krakenjs/lusca#luscacspoptions
- rewrite it with controllers https://github.com/sahat/hackathon-starter/tree/master/controllers

Pie = require("../../models/pie.js.coffee")

routes = (app) ->
  app.namespace "/admin", ->

    app.namespace "/pies", ->
      app.get "/", (req, res) ->
        pie = new Pie {}
        res.render "#{__dirname}/views/pies/all", 
          title: "View All Pies"
          stylesheet: "admin"
          pie: pie


module.exports = routes
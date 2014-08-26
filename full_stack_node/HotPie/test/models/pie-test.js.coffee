assert  = require("assert")
Pie     = require("../../models/pie.js.coffee")

describe "Pie", ->

  describe "create", ->
    pie = null

    before ->
      pie = new Pie {name: "Key Lime"}

    it "sets name", ->
      assert.equal pie.name, "Key Lime"

    it "defaults to some state", ->
      assert.equal pie.state, "inactive"

    it "generates id", ->
      assert.equal pie.id, "Key-Lime"

  # afterEach ->
  #   redis.del Pie.key()
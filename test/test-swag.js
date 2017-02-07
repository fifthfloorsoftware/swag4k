'use strict'

const swagger = require('../lib/swag')
const assert = require('chai').assert
const koa = require('koa')
const defaults = require('../lib/defaults/defaults')
const schema = require('./joi-schemas')

describe('test do-swagger', function () {
  let opts
  beforeEach('setup', function () {
    opts = {
      basePath: '/v1/api',
      swaggerPath: '/swagger',
      info: {
        description: 'This is a sample server Petstore server. You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For this sample, you can use the api key `special-key` to test the authorization filters.',
        version: '1.0.0',
        title: 'Swagger Petstore',
        contact: {email: 'johndoe@gmail.com'},
        basePath: '/v2'
      },
      addDefaults: true,
      joiDefinitions: schema.schemas
    }
  })

  it('should be able to parse a jsdoc and create a swaggerDoc object', function () {
    return Promise.resolve().then(function () {
      return swagger._parseJsDocs('./test/jsdocsPet.js', opts)
    }).then(function (swaggerDocs) {
      assert.isOk(swaggerDocs)
    }).catch(function (err) {
      assert.isNotOk(err)
    })
  })

  it('should be able to parse multiple files with jsdocs in them, and create a single jsdoc', function () {
    opts.files = ['./test/jsdocsPet.js', './test/jsdocsStore.js']
    let app = koa()
    return Promise.resolve().then(function (resolve, reject) {
      return swagger.init(opts, app)
    }).then(function (something) {
      assert.deepEqual(app.middleware[0].router.stack[0].path, opts.basePath + opts.swaggerPath)
    }).catch(function (err) {
      assert.isNotOk(err)
    })
  })
})

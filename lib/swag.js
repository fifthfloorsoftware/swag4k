'use strict'

const fs = require('fs')
const doctrine = require('doctrine')
const _ = require('lodash')
const defaults = require('../lib/defaults/defaults')
const j2s = require('joi-to-swagger')
let swaggerDocs = {}

/**
 *
 * @param doc
 * @returns {string}
 */
function getResourcePath (doc) {
  const httpMethodTag = doc.tags.find(function (tag, index, tags) {
    return tag.title === 'method'
  })
  const resourcePathTag = doc.tags.find(function (tag, index, tags) {
    return tag.title === 'resourcePath'
  })

  let pathString = `paths.${resourcePathTag.description}.${httpMethodTag.name.toLowerCase()}`
  _.set(swaggerDocs, pathString, {})
  return pathString
}

/**
 * creates a path object to be child of paths object
 * @param doc
 * @param path
 */
function createPathObject (doc, path) {
  doc.tags.forEach(function (tag) {
    if (!(tag.title === 'resourcePath' || tag.title === 'method')) {
      let description = tag.description
      try {
        let json = JSON.parse(description)
        _.set(swaggerDocs, `${path}.${tag.title}`, json)
      } catch (err) {
        _.set(swaggerDocs, `${path}.${tag.title}`, description)
        console.log(`Could not parse ${description} to JSON, setting setting object as string`)
      }
    }
  })
}

function addDefinitionsFromObject(defCollection) {
  defCollection.forEach(function (definition) {
    Object.keys(definition).forEach(function (key) {
      swaggerDocs.definitions[key] = definition[key]
    })
  })
}
function addOtherDefaults(opts) {

  if (opts.addDefaults) {
    addDefinitionsFromObject(defaults.definitions);
  }

  let joiDefinitions = opts.joiDefinitions;
  const joiDefs = []
  if (joiDefinitions) {
    joiDefinitions.forEach(function (definition) {
      let hasClassName = definition._meta && definition._meta.length > 0 && definition._meta[0].className
      if(hasClassName) {
        let joidef = j2s(definition)  //todo maybe get all the keys from the definitions in order to pass the array into this constructor
        if (joidef.definitions) {
          joiDefs.push(joidef.definitions)
        }
        console.log(joidef)
      } else {
        console.log({message: 'Joi schema does not have className skipping...', joiSchema: definition})
      }
    })
  }
  addDefinitionsFromObject(joiDefs)
}
/**
 * This will only create the 'tags' array, 'paths' object and its children, and 'definitions' object all other parts of the spec will need to
 * be provided via the opts object that is passed in during the invocation of the init function
 * @param file
 * @param opts
 */
function _parseJsDocs (file, opts) {
  return new Promise(function (resolve, reject) {
    fs.readFile(file, function (err, data) {
      if (err) {
        throw new Error('There was a problem parsing your swagger javadocs')
      }
      let js = data.toString()
      let regex = /\/\*\*([\s\S]*?)\*\//gm
      let fragments = js.match(regex)  // fragments of jsdocs found in given file
      swaggerDocs.paths = swaggerDocs.paths || {}
      swaggerDocs.definitions = swaggerDocs.definitions || {}

      if (!fragments) {
        console.log('There were no jsdocs found in this file, continuing execution...')
        resolve()
        return
      }
      fragments.forEach(function (fragment, index) {
        let doc = doctrine.parse(fragment, {unwrap: true})  // remove comment tags after the docs have been parsed
        let fragmentTitle = doc.tags[0].title
        if (index === 0 && fragmentTitle === 'swagger') { // check if swagger file requires swaggerification, the first jsdoc's first fragmentTitle should be 'swagger' otherwise no swagger
          getSwaggerTagArray(doc, fragments)
        } else if (index === 0 && fragmentTitle !== 'swagger') {
          console.log('There was no swagger annotation contained in the first javadoc in this file, continuing execution...')
          resolve()
          return
        } else {
          if (fragmentTitle === 'resourcePath') {
            const path = getResourcePath(doc)
            if (path) {
              createPathObject(doc, path)
            } else {
              console.log('http method not found, bypassing swagger fragment')
            }
          }
          if (fragmentTitle === 'definition') {
            try {
              swaggerDocs.definitions[doc.tags[1].title] = JSON.parse(doc.tags[1].description)
            } catch (err) {
              console.log(`There was a problem parsing your definition ${doc.tags[1].title}`)
            }
          }
        }
      })
      addOtherDefaults(opts, swaggerDocs);

      console.log({swaggerDocs}, 'Swagger doc creation complete')
      resolve(swaggerDocs)
      return
    })
  })
}

/**
 * Creates the tags object array
 * @param doc
 */
function getSwaggerTagArray (doc) {
  let tag = {}
  let tags = []
  let jsTags = doc.tags
  jsTags.shift()
  jsTags.forEach(function (jsTag) {
    let description = jsTag.description
    let title = jsTag.title
    if (title === 'externalDocs') {
      try {
        description = JSON.parse(description)
      } catch (err) {
        console.log('There was a problem parsing your externalDocs object in your swagger jsDocs')
      }
    }
    _.set(tag, title, description || jsTag.name)
  })
  tags.push(tag)
  swaggerDocs.tags = tags
}

/**
 * see http://petstore.swagger.io/v2/swagger.json structure to see how this json can be structured, if this is incorrect you may get unexpected behavior from the sagger ui
 "swagger": "", swagger version
 "info": {},
 "host": "",  //don't need the host, the ui will automatically pull the host from the client if not provided
 "basePath": "",  //this will be the basepath that is automatically prepended on to the searched term in the swagger ui search box ie the context root
 "schemes": [],
 "securityDefinitions": {},
 "externalDocs": {}
 */
function init (opts, app) {

  if(!app){
    throw new Error('Missing koa app')
  }
  if(!opts){
    throw new Error('Missing opts')
  }

  if (opts.swagger) {  // opts can include
    swaggerDocs.swagger = opts.swagger
    swaggerDocs.basePath = opts.basePath
    swaggerDocs.info = opts.info
    swaggerDocs.externalDocs = opts.externalDocs
    swaggerDocs.securityDefinitions = opts.securityDefinitions
    swaggerDocs.schemes = opts.schemes
  }

  opts.files.forEach(function (file) {
    _parseJsDocs(file, swaggerDocs)
  })

  const swagGenerator = function *(next) {
    this.body = swaggerDocs
  }

  const router = require('koa-router')()
  router.get(opts.swaggerPath, swagGenerator)
  const api = require('koa-router')()
  api.use(opts.basePath, router.routes())
  app.use(api.routes())
}

module.exports._parseJsDocs = _parseJsDocs
module.exports.init = init


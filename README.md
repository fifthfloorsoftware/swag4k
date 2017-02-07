#swag4k 

swagger-for-koa creates a [swagger](http://swagger.io/) endpoint for your api based on the description provided by your jsdocs.

In contrast to other swagger-koa implementations, swag4k does not force the user to have a ui bundled into your service, parses javadocs formatted 
in json(no .yml!), is compatible with [joi](https://github.com/hapijs/joi) schemas, creates a swagger [v2 spec](http://petstore.swagger.io/v2/swagger.json).  

##Usage
###koa configuration 

```javascript
//example invocation of init function with example opts; creates endpoint with path /api/public/v1/swagger
const swag4k = require('swagger-4-koa')
  opts.info = {
    description: 'This is a sample server Petstore server. You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For this sample, you can use the api key `special-key` to test the authorization filters.',
    version: '1.0.0',
    title: 'Swagger Petstore',
    contact: {email: 'johndoe@gmail.com'},
    basePath: '/v2'
  }
  opts.swagger = '2.0'
  opts.basePath = '/api/public/v1'
  opts.swaggerPath = '/swagger'
  opts.schemes = ['http', 'https']
  opts.securityDefinitions = {} 
  opts.files = ['./api'] //files that contain swagger jsdocs
  opts.addDefaults = true //adds default definitions contained in defaults file 
  opts.joiDefinitions = [
      Joi.object().keys({
        id:      Joi.number().integer().positive().required(),
        name:    Joi.string(),
        email:   Joi.string().email().required(),
        created: Joi.date().allow(null),
        active:  Joi.boolean().default(true),
      })
  ]
  const app = koa()
  swag4k.init(opts, app)  
```   

###Router configuration

```javascript
// example of what a jsdoc should look like in an api file
const router = require('koa-router')


//jsdoc with @swagger title should be at top of any file you want swagger4k to find
/**
 * @swagger
 * @name pet
 * @description Everything about your pet
 * @externalDocs {"description" : "find out more", "url": "path/to/README.md"}
 */


//endpoint jsdocs must have path and method titles
/**
 * @resourcePath /pet
 * @method POST
 * @summary Add a new pet to the pet store
 * @operationId addPet
 * @consumes ["application/json", "application/xml"]
 * @produces ["application/json", "application/xml"]
 * @tags ["pets"]
 * @parameters [
    {
      "description": "Pet object that needs to be added to the store",
      "in": "body",
      "name": "body",
      "required": true,
      "schema": {
        "$ref": "#/definitions/Pet"
      }
    }
  ] 
 * @responses { "405" : {"description": "Invalid input"} }
 * @security [
   {
     "petstore_auth": [
       "write:pets",
       "read:pets"
     ]
   }
 ]
 * @deprecated false
 */
router.post('/pet', postPet)
function * postPet(next) {
  //creating new pet
}

/**
 * @resourcePath /pet
 * @method PUT
 * ...
 * @tags ["pets"]
 */
router.put('/put', putPet)
function * putPet(next) {
  //updating new pet
}

/**
 * @resourcePath /pet/findByStatus
 * @method GET
 * ...
 * @tags ["pets"]
 */
router.get('/pet/findByStatus', findByStatus)
function * findByStatus(next) {
  //fetching new pet by status
}

/**
 * * @resourcePath /pet/findByStatus
 * @method DELETE
 
 * ...
 * @responses  {
 * 	"200": {
 * 		"description": "successful operation",
 * 		"schema": {
 * 			"type": "string"
 * 		},
 * 		"headers": {
 * 			"X-Rate-Limit": {
 * 				"type": "integer",
 * 				"format": "int32",
 * 				"description": "calls per hour allowed by the user"
 * 			},
 * 			"X-Expires-After": {
 * 				"type": "string",
 * 				"format": "date-time",
 * 				"description": "date in UTC when token expires"
 * 			}
 * 		}
 * 	},
 * 	"400": {
 * 		"description": "Invalid username/password supplied"
 * 	}
 * }
 */
router.delete('/pet/findByStatus', deleteByStatus)
function * deleteByStatus(next) {
  //deleting pet by status
}


//this is what a pet looks like 
/**
 * @definition
 * @Pet {
 * 	"type": "object",
 * 	"required": [
 * 		"name",
 * 		"photoUrls"
 * 	],
 * 	"properties": {
 * 		"id": {
 * 			"type": "integer",
 * 			"format": "int64"
 * 		},
 * 		"category": {
 * 			"$ref": "#/definitions/Category"
 * 		},
 * 		"name": {
 * 			"type": "string",
 * 			"example": "doggie"
 * 		},
 * 		"photoUrls": {
 * 			"type": "array",
 * 			"xml": {
 * 				"name": "photoUrl",
 * 				"wrapped": true
 * 			},
 * 			"items": {
 * 				"type": "string"
 * 			}
 * 		},
 * 		"tags": {
 * 			"type": "array",
 * 			"xml": {
 * 				"name": "tag",
 * 				"wrapped": true
 * 			},
 * 			"items": {
 * 				"$ref": "#/definitions/Tag"
 * 			}
 * 		},
 * 		"status": {
 * 			"type": "string",
 * 			"description": "pet status in the store",
 * 			"enum": [
 * 				"available",
 * 				"pending",
 * 				"sold"
 * 			]
 * 		}
 * 	},
 * 	"xml": {
 * 		"name": "Pet"
 * 	}
 * }
 */
```

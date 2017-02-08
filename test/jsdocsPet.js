/**
 * @swagger
 * @name /pet
 * @description Everything about your pet
 * @externalDocs {"description" : "find out more", "url": "path/to/README.md"}
 */

/**
 * @path /pet
 * @method POST
 * @summary Add a new pet to the pet store
 * @operationId addPet
 * @consumes ["application/json", "application/xml"]
 * @produces ["application/json", "application/xml"]
 * @tags ["pets"]
 * @parameters [{
 *      "in": "body",
 *      "name": "body",
 *      "description": "Pet object that needs to be added to the store",
 *      "required": true,
 *      "schema": {
 *      "$ref": "#/definitions/Pet"
 *      }
 *      }]
 * @responses { "405" : {"description": "Invalid input"} }
 */

/**
 * @path /pet
 * @method PUT
 */

/**
 * @path /pet/findByStatus
 * @method GET
 */

/**
 * @path /pet/findByStatus
 * @method DELETE
 */

/**
 * @definition
 * @User {
 *   "type": "object",
 *   "properties": {
 *     "id": {
 *       "type": "integer",
 *       "format": "int64"
 *     },
 *     "username": {
 *       "type": "string"
 *     },
 *     "firstName": {
 *       "type": "string"
 *     },
 *     "lastName": {
 *       "type": "string"
 *     },
 *     "email": {
 *       "type": "string"
 *     },
 *     "password": {
 *       "type": "string"
 *     },
 *     "phone": {
 *       "type": "string"
 *     },
 *     "userStatus": {
 *       "type": "integer",
 *       "format": "int32",
 *       "description": "User Status"
 *     }
 *   },
 *   "xml": {
 *     "name": "User"
 *   }
 * }
 */

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


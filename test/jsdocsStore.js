'use strict'

/**
 * @swagger
 * @name store
 * @description Access to petstore orders
 */

/**
 * @path /store/inventory
 * @method GET
 * @summary Returns pet inventories by status
 * @operationId "getInventory"
 * @produces ["application/json"]
 * @tags ["store"]
 * @responses {
 * 	"200": {
 * 		"description": "successful operation",
 * 		"schema": {
 * 			"type": "object",
 * 			"additionalProperties": {
 * 				"type": "integer",
 * 				"format": "int32"
 * 			}
 * 		}
 * 	}
 * }
 */

/**
 * @path /store/order/{orderId}
 * @method GET
 * @summary Find purchase order by ID
 * @operationId "getOrderById"
 * @produces ["application/xml", "application/json"]
 * @parameters [{
 *     "name": "orderId",
 *     "in": "path",
 *     "description": "ID of pet that needs to be fetched",
 *     "required": true,
 *     "type": "integer",
 *     "maximum": 10,
 *     "minimum": 1,
 *     "format": "int64"
 * @responses {
 * 	"200": {
 * 		"description": "successful operation",
 * 		"schema": {
 * 			"$ref": "#/definitions/Order"
 * 		}
 * 	},
 * 	"400": {
 * 		"description": "Invalid ID supplied"
 * 	},
 * 	"404": {
 * }
 */

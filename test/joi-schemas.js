'use strict'

const Joi = require('joi')

const stringMin1Max256 = Joi.string().min(1).max(256)
const schema = Joi.object().keys(
  {
    organization_name: stringMin1Max256,
    type: stringMin1Max256,
    status: Joi.string().alphanum().min(1).max(256),
    jde: Joi.number().integer().min(1).max(10000000000),  // can be up to 10 numeric characters
    division: Joi.string().alphanum().min(1).max(32),
    primary_address: Joi.object({
      address_line1: stringMin1Max256,
      address_line2: stringMin1Max256.allow(null),
      city: stringMin1Max256,
      country: stringMin1Max256,
      state: Joi.string().length(2).uppercase(),
      zip: Joi.number().min(10000).max(99999).required() // zip must be 5 characters
    }).required(), // pulled address from required
    correlation_id: Joi.string().guid({version: ['uuidv4']})
  }
).required().meta({className: 'Client'})

const otherSchema = // input
  Joi.object().keys({
    id:      Joi.number().integer().positive().required(),
    name:    Joi.string(),
    email:   Joi.string().email().required(),
    created: Joi.date().allow(null),
    active:  Joi.boolean().default(true),
  }).meta({className: 'OtherSchema'})

const noNameSchema = // input
  Joi.object().keys({
    id:      Joi.number().integer().positive().required(),
    name:    Joi.string(),
    email:   Joi.string().email().required(),
    created: Joi.date().allow(null),
    active:  Joi.boolean().default(true),
  })

const schemaWithArrayOfObjects = Joi.object().keys(
  {
    organization_name: Joi.string().min(1).max(256),
    type: Joi.string().min(1).max(256),
    status: Joi.string().alphanum().min(1).max(256),
    jde: Joi.number().integer().min(1).max(10000000000),  //can be up to 10 numeric characters
    division: Joi.string().alphanum().min(1).max(32),
    primary_address: Joi.array().items(Joi.object({
      address_line1: Joi.string().min(1).max(256),
      address_line2: Joi.string().min(1).max(256).allow(null),
      city: Joi.string().min(1).max(256),
      country: Joi.string().min(1).max(256),
      state: Joi.string().length(2).uppercase(),
      zip: Joi.number().min(10000).max(99999).required() //zip must be 5 characters
    })).required(), //pulled address from required
    correlation_id: Joi.string().guid({version: ['uuidv4']})
  }
).meta({className: 'ArrayOfObjects'})

module.exports.schemas = [schema, otherSchema, noNameSchema, schemaWithArrayOfObjects]
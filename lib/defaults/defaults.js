const definitions = [
  {
    BadRequest: {
      type: 'object',
      properties: {
        reason_code: {
          type: 'string'
        },
        message: {
          type: 'string'
        },
        error: {
          type: 'object',
          properties: {
            details: {
              type: 'array',
              items: {
                $ref: '#/definitions/ErrObj'
              }
            }
          }
        },
        _object: {
          type: 'object',
          properties: {
            details: {
              type: 'object'
            }
          }
        }
      },
      xml: {
        name: 'BadRequest'
      }
    }
  },
  {
    ErrObj: {
      type: 'object',
      properties: {
        message: {
          type: 'string'
        },
        path: {
          type: 'string'
        },
        type: {
          type: 'string'
        },
        context: {
          type: 'object',
          properties: {
            limit: {
              type: 'integer'
            },
            value: {
              type: 'integer'
            },
            key: {
              type: 'string'
            }
          }
        }
      },
      xml: {
        name: 'ErrObj'
      }
    }
  },
  {
    Success202: {
      type: 'object',
      properties: {
        timestamp: {
          type: 'string',
          format: 'date-time'
        },
        message: {
          type: 'string'
        },
        status: {
          type: 'integer'
        }
      },
      xml: {
        name: 'Success202'
      }
    }
  }
]

module.exports.definitions = definitions

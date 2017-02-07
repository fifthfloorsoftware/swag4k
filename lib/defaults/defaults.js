const definitions = [
  {
    BadRequest: {
      type: 'object',
      properties: {
        status: {
          type: 'integer'
        },
        body: {
          type: 'object',
          properties: {
            errors: {
              type: 'array',
              items: {
                type: 'object'
              }
            }
          }
        }
      },
      xml: {
        name: 'BadRequest'
      }
    }
  }
]

module.exports.definitions = definitions

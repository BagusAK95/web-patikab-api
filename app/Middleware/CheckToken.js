'use strict'

const Response = use('App/Helpers/ResponseHelper')

class CheckToken {
  async handle({
    auth,
    response
  }, next, rule) {
    try {
      const user = await auth.getUser()
      if (rule[0] == 'administrator') {
        if (user.level != 1) {
          return response.send(Response.format(false, 'Akses ditolak', null))
        }
      } else if (rule[0] == 'operator') {
        if (user.level != 2) {
          return response.send(Response.format(false, 'Akses ditolak', null))
        }
      }

      await next()
    } catch (error) {
      return response.send(Response.format(false, 'Token tidak valid', null))
    }
  }
}

module.exports = CheckToken

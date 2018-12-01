'use strict'

const Hash = use('Hash')
const User = use('App/Models/User')
const Response = use('App/Helpers/ResponseHelper')

class UserController {
  async getToken({
    request,
    auth
  }) {
    try {
      const { nip, password } = request.all()
      const data = await User.query().where('nip', nip).first()
      if (data) {
        const isSame = await Hash.verify(password, data.password)
        if (isSame) {
          if (data.status == 1) {
            const token = await auth.generate(data)

            return Response.format(true, null, token)
          } else {
            return Response.format(false, 'User tidak aktif', null)
          }
        } else {
          return Response.format(false, 'Kata sandi salah', null)
        }
      } else {
        return Response.format(false, 'NIP tidak ditemukan', null)
      }
    } catch (error) {
      return Response.format(false, error, null)
    }
  }
}

module.exports = UserController

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
      const {
        nip,
        password
      } = request.all()
      const data = await User.query().where('nip', nip).first()
      if (data) {
        const isSame = await Hash.verify(password, data.password)
        if (isSame) {
          if (data.status == 1) {
            const token = await auth.generate(data)

            data.last_ip = request.header('x-forwarded-for')
            data.last_login = new Date()
            await data.save()

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

  async add({
    request
  }) {
    try {
      let data = request.only(['id_opd', 'nip', 'nama', 'level', 'status'])
      data.password = await Hash.make(data.nip)

      await User.create(data)

      return Response.format(true, 'Berhasil disimpan', null)
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async update({
    params,
    request
  }) {
    try {
      const user = await User.query().where('id', params.id).first()
      if (user) {
        const data = request.only(['id_opd', 'nip', 'nama', 'level', 'status'])

        await User.query()
          .where('id', params.id)
          .update(data)

        return Response.format(true, 'Berhasil disimpan', null)
      } else {
        return Response.format(false, 'User tidak ditemukan', null)
      }
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async delete({
    params
  }) {
    try {
      const user = await User.query().where('id', params.id).first()
      if (user) {
        await User.query().where('id', params.id).delete()

        return Response.format(true, 'Berhasil dihapus', null)
      } else {
        return Response.format(false, 'User tidak ditemukan', null)
      }
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async list({
    request
  }) {
    try {
      const params = request.get()

      let sql = []
      if (params.id_opd) sql.push('id_opd = ' + params.id_opd)
      if (params.nama) sql.push(`MATCH(nama) AGAINST('` + params.nama + `' IN BOOLEAN MODE)`)
      if (params.status) sql.push('status = ' + params.status)

      const user = await User.query()
        .whereRaw(sql.join(' AND '))
        .paginate(Number(params.page), Number(params.limit))

      return Response.format(true, null, user)
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async detail({
    params
  }) {
    try {
      const user = await User.query().where('id', params.id).first()
      if (user) {
        return Response.format(true, null, user)
      } else {
        return Response.format(false, 'User tidak ditemukan', null)
      }
    } catch (error) {
      return Response.format(false, error, null)
    }
  }
}

module.exports = UserController

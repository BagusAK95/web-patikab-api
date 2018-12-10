'use strict'

const Response = use('App/Helpers/ResponseHelper')
const Menu = use('App/Models/Menu')

class MenuController {
  async add({
    request,
    auth
  }) {
    try {
      const user = await auth.getUser()

      let data = request.only(['id_opd', 'id_parent', 'id_konten', 'nama', 'url'])
      data.id_user = user.id

      await Menu.create(data)

      return Response.format(true, 'Berhasil disimpan', null)
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async update({
    params,
    request,
    auth
  }) {
    try {
      const user = await auth.getUser()

      let sql = []
      if (user.level == 2) sql.push('id_opd = ' + user.id_opd)
      sql.push('id = ' + params.id)

      const menu = await Menu.query().whereRaw(sql.join(' AND ')).first()
      if (menu) {
        let data = request.only(['id_parent', 'id_konten', 'nama', 'url'])
        data.id_user = user.id_user

        await Menu.query()
          .where('id', params.id)
          .update(data)

        return Response.format(true, 'Berhasil disimpan', null)
      } else {
        return Response.format(false, 'Menu tidak ditemukan', null)
      }
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async updateStatusPublish({
    params,
    request,
    auth
  }) {
    try {
      const user = await auth.getUser()
      const data = request.only(['status_publish'])

      let sql = []
      if (user.level == 2) sql.push('id_opd = ' + user.id_opd)
      sql.push('id = ' + params.id)

      const menu = await Menu.query().whereRaw(sql.join(' AND ')).first()
      if (menu) {
        switch (Number(data.status_publish)) {
          case 1: //Draft
            return Response.format(false, 'Status tidak diijinkan', null)
          case 2: //Waiting
            if (user.level != 2) return Response.format(false, 'Status tidak diijinkan', null)
            break
          case 3: //Publish
            if (user.level != 1) return Response.format(false, 'Status tidak diijinkan', null)
            break
        }

        menu.status_publish = data.status_publish
        await menu.save()

        return Response.format(true, 'Berhasil disimpan', null)
      } else {
        return Response.format(false, 'Menu tidak ditemukan', null)
      }
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async delete({
    params,
    auth
  }) {
    try {
      const user = await auth.getUser()

      let sql = []
      if (user.level == 2) sql.push('id_opd = ' + user.id_opd)
      sql.push('id = ' + params.id)

      const menu = await Menu.query().whereRaw(sql.join(' AND ')).first()
      if (menu) {
        await Menu.query().where('id', params.id).delete()

        return Response.format(true, 'Berhasil dihapus', null)
      } else {
        return Response.format(false, 'Menu tidak ditemukan', null)
      }
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async list({
    request,
    auth
  }) {
    try {
      const user = auth.getUser()
      const params = request.get()

      let sql = []
      if (user.level == 2) {
        sql.push('id_opd = ' + user.id_opd)
      } else {
        if (params.id_opd) sql.push('id_opd = ' + params.id_opd)
      }
      if (params.nama) sql.push(`MATCH(nama) AGAINST('` + params.nama + `' IN BOOLEAN MODE)`)
      if (params.status_publish) sql.push('status_publish = ' + params.status_publish)

      const menu = await Menu.query()
        .whereRaw(sql.join(' AND '))
        .paginate(Number(params.page), Number(params.limit))

      return Response.format(true, null, menu)
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async detail({
    params,
    auth
  }) {
    try {
      const user = auth.getUser()

      let sql = []
      if (user.level == 2) sql.push('id_opd = ' + user.id_opd)
      sql.push('id = ' + params.id)

      const menu = await Menu.query()
        .whereRaw(sql.join(' AND '))
        .first()

      if (menu) {
        return Response.format(true, null, menu)
      } else {
        return Response.format(false, 'Menu tidak ditemukan', null)
      }
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async listAllPublish() {
    try {
      let data = {
        id: null,
        nama: null,
        url: null,
        nodes: []
      }

      const parents = await Menu.query({ status_publish: 3, id_parent: null })
      for (let i = 0; i < parents.length; i++) {
        const parent = parents[i]
        data.id = parent.id
        data.nama = parent.nama
        data.url = parent.url

        const nodes1 = await Menu.query({ status_publish: 3, id_parent: parent.id })
        for (let j = 0; j < nodes1.length; j++) {
          const node1 = nodes1[j]
          data.nodes.push({
            id: node1.id,
            nama: node1.nama,
            url: node1.url,
            nodes: []
          })

          const nodes2 = await Menu.query({ status_publish: 3, id_parent: node1.id })
          for (let k = 0; k < nodes2.length; k++) {
            const node2 = nodes2[k];
            data.nodes[j].nodes.push({
              id: node2.id,
              nama: node2.nama,
              url: node2.url
            })
          }
        }
      }

      return Response.format(true, null, data)
    } catch (error) {
      return Response.format(false, error, null)
    }
  }

  async detailPublish({
    params
  }) {
    try {
      const menu = await Menu.query()
        .where({
          id: params.id,
          status_publish: 3
        })
        .first()

      if (menu) {
        return Response.format(true, null, menu)
      } else {
        return Response.format(false, 'Menu tidak ditemukan', null)
      }
    } catch (error) {
      return Response.format(false, error, null)
    }
  }
}

module.exports = MenuController

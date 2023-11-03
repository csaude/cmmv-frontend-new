import { Model } from 'pinia-orm'
//import db from 'src/store/localbase'

export class UserLogin extends Model {
  static entity = 'userLogins'

  static state () {
    return {
      fetching: false
    }
}
  // static types () {
  //   return {
  //       UTENTELOGIN: UtenteLogin,
  //       MOBILIZERLOGIN: MobilizerLogin
  //   }
  // }

  static fields () {
    return {
      id: this.attr(null),
      username: this.attr(''),
      password: this.attr(''),
      role: this.attr(null),
      fullName: this.attr(''),
      access_token: this.attr(''),
      refresh_token: this.attr(''),
      firstNames: this.attr(''),
      lastNames: this.attr(''),
      province_id: this.attr(''),
      district_id: this.attr(''),
      clinic_id: this.attr('')
    }
  }
/*
  static async apiGetAll () {
    return await this.api().get('/secUser')
  }

  static localDbAdd (user) {
    return db.newDb().collection('users').add(user)
  }

  static localDbGetById (id) {
    return db.newDb().collection('users').doc({ id: id }).get()
  }

  static localDbGetAll () {
    return db.newDb().collection('users').get()
  }

  static localDbUpdate (user) {
    return db.newDb().collection('users').doc({ id: user.id }).set(user)
  }

  static localDbUpdateAll (users) {
    return db.newDb().collection('users').set(users)
  }

  static localDbDelete (user) {
    return db.newDb().collection('users').doc({ id: user.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('users').delete()
  }
  */
}

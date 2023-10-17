import { Model } from 'pinia-orm'
import Utente from '../utente/Utente'
import db from 'src/store/localbase'

export default class Message extends Model {
  static entity = 'messages'

  static fields () {
    return {
      id: this.attr(null),
      description: this.attr(''),
      messageType: this.attr(''),
      smsDate: this.attr(''),
      utente_id: this.attr(''),

      // Relationships
      utente: this.belongsTo(Utente, 'utente_id')
    }
  }

  static localDbAdd (message) {
    return db.newDb().collection('messages').add(message)
  }

  static localDbGetById (id) {
    return db.newDb().collection('messages').doc({ id: id }).get()
  }

  static localDbGetAll () {
    return db.newDb().collection('messages').get()
  }

  static localDbUpdate (message) {
    return db.newDb().collection('messages').doc({ id: message.id }).set(message)
  }

  static localDbUpdateAll (messages) {
    return db.newDb().collection('messages').set(messages)
  }

  static localDbDelete (message) {
    return db.newDb().collection('messages').doc({ id: message.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('messages').delete()
  }
}

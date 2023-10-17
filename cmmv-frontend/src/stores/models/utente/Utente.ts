import { Model } from 'pinia-orm';
import Address from '../address/Address'
import Appointment from '../appointment/Appointment'
import Message from '../messages/Message'
import CommunityMobilizer from '../mobilizer/CommunityMobilizer'
import InfoDocsOrImages from '../dorcOrImages/InfoDocsOrImages'
import Clinic from '../clinic/Clinic'
import { v4 as uuidv4 } from 'uuid'

export default class Utente extends Model {
  static entity = 'utentes'
 // static eagerLoad = ['address', 'mobilizer', 'clinic', 'appointments', 'infoDocsImages']

  static fields () {
    return {
      id: this.attr(null),
      firstNames: this.attr(''),
      lastNames: this.attr(''),
      birthDate: this.attr(''),
      cellNumber: this.attr(''),
      whatsappNumber: this.attr(''),
      preferedLanguage: this.attr(''),
      documentType: this.attr(''),
      documentNumber: this.attr(''),
      systemNumber: this.attr(''),
      haspartner: this.attr(''),
      status: this.attr(''),
      selected: this.attr(''),
      syncStatus: this.attr(''),
      registerDate: this.attr(''),
      communityMobilizer_id: this.attr(''),
      clinic_id: this.attr(''),

      // Relationships
      addresses: this.hasMany(Address, 'utente_id'),
      communityMobilizer: this.belongsTo(CommunityMobilizer, 'communityMobilizer_id'),
      infoDocsImages: this.hasMany(InfoDocsOrImages, 'infoDocsImages_id'),
      messages: this.hasMany(Message, 'utente_id'),
      appointments: this.hasMany(Appointment, 'utente_id'),
      // user: this.hasOne(UtenteLogin, 'utente_id'),
      clinic: this.belongsTo(Clinic, 'clinic_id')
    }
  }
  static piniaOptions = {
    persist: true,
  };

  getFullName () {
    return this.firstnames + ' ' + this.lastname
  }

  static async apiSave (utente) {
    return await this.api().post('/utente', utente)
  }

  static async apiUpdate (utente) {
    return await this.api().patch('/utente/' + utente.id, utente)
  }

  static localDbAdd (utente) {
    return db.newDb().collection('utentes').add(utente)
  }

  static localDbGetById (id) {
    return db.newDb().collection('utentes').doc({ id: id }).get()
  }

  static localDbGetAll () {
    return db.newDb().collection('utentes').get()
  }

  static localDbUpdate (utente) {
    return db.newDb().collection('utentes').doc({ id: utente.id }).set(utente)
  }

  static localDbUpdateAll (utentes) {
    return db.newDb().collection('utentes').set(utentes)
  }

  static localDbDelete (utente) {
    return db.newDb().collection('utentes').doc({ id: utente.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('utentes').delete()
  }

  static localDbAddWithKey (utente) {
    return db.newDb().collection('utentes').add(utente, utente.id)
  }
}

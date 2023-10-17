import { Model } from 'pinia-orm'
import Utente from '../utente/Utente'
import InfoDocsOrImages from '../dorcOrImages/InfoDocsOrImages'
import District from '../district/District'
import db from 'src/store/localbase'
// import { MobilizerLogin } from '../userLogin/UserLoginHierarchy'

export default class CommunityMobilizer extends Model {
  static entity = 'communityMobilizers'

  get contacts () {
    return `${this.cellNumber} ${this.cellNumber2}`
  }

  get fullName () {
    return `${this.firstNames} ${this.lastNames}`
  }

  static fields () {
    return {
      id: this.attr(null),
      firstNames: this.attr(''),
      lastNames: this.attr(''),
      cellNumber: this.attr(''),
      cellNumber2: this.attr(''),
      uuid: this.attr(''),
      district_id: this.attr(''),
      // Relationships
      utentes: this.hasMany(Utente, 'communityMobilizer_id'),
      docsOrImages: this.hasMany(InfoDocsOrImages, 'docsOrImages_id'),
      district: this.belongsTo(District, 'district_id')
    }
  }

  static async apiGetAll () {
    return await this.api().get('/communityMobilizer')
  }

  static async apiFetchById (id) {
    return await this.api().get(`/communityMobilizer/${id}`)
  }

  static async apiFetchByDistrictId (districtId) {
    return await this.api().get('/communityMobilizer/district/' + districtId)
  }

  static async apiSave (communityMobilizer) {
    return await this.api().post('/communityMobilizer', communityMobilizer)
  }

  static localDbAdd (communityMobilizer) {
    return db.newDb().collection('communityMobilizers').add(communityMobilizer)
  }

  static localDbGetById (id) {
    return db.newDb().collection('communityMobilizers').doc({ id: id }).get()
  }

  static localDbGetAll () {
    return db.newDb().collection('communityMobilizers').get()
  }

  static localDbUpdate (communityMobilizer) {
    return db.newDb().collection('communityMobilizers').doc({ id: communityMobilizer.id }).set(communityMobilizer)
  }

  static localDbUpdateAll (communityMobilizers) {
    return db.newDb().collection('communityMobilizers').set(communityMobilizers)
  }

  static localDbDelete (communityMobilizer) {
    return db.newDb().collection('communityMobilizers').doc({ id: communityMobilizer.id }).delete()
  }

  static localDbDeleteAll () {
    return db.newDb().collection('communityMobilizers').delete()
  }
}

import { Notify } from 'quasar';
import { UserLogin } from 'src/stores/models/userLogin/UserLogin'
import api from 'src/services/api/apiService/apiService';
import { useRepo } from 'pinia-orm';
import { useSystemUtils } from 'src/composables/shared/systemUtils/systemUtils';


const userLogin = useRepo(UserLogin);


export default {
  logout () {
    return api().get('logout')
      .catch((error) => {
        if (error.response) {
          console.log(JSON.stringify(error.response))
          alert(JSON.stringify(error.response.data))
        } else if (error.request) {
          console.log(error.request)
        } else {
          console.log('Error', error.message)
        }
      })
  },
  fetchUsers () {
    return api().get('secUser')
      .catch((error) => {
        if (error.response) {
          console.log(error.response)
          alert(error.response.data)
        } else if (error.request) {
          console.log(error.request)
        } else {
          console.log('Error', error.message)
        }
      })
  },
  signup (params: any) {
    return api().post('user/signup', params)
      .catch((error) => {
        if (error.response) {
          console.log(error.response)
          alert(error.response.data)
        } else if (error.request) {
          console.log(error.request)
        } else {
          console.log('Error', error.message)
        }
      })
  },
  login (params: any) {
    return api().post('/login', params)
      .catch((error) => {
        if (error.response) {
          Notify.create({
            icon: 'announcement',
            message: 'Utilizador ou a senha inválida',
            type: 'negative',
            progress: true,
            timeout: 3000,
            position: 'top',
            color: 'negative',
            textColor: 'white',
            classes: 'glossy'
          })
          console.log('O erro: ', error.response)
        } else if (error.request) {
          console.log(error.request)
        } else {
          Notify.create({
            icon: 'announcement',
            message: 'Problemas ao conectar-se com o Servidor. ',
            type: 'negative',
            progress: true,
            timeout: 3000,
            position: 'top',
            color: 'negative',
            textColor: 'white',
            classes: 'glossy'
          })
          console.log('Error', error.message)
        }
      })
  },
  updateUser (params:any) {
    return api().put('secUser/' + params.id, params)
      .catch((error) => {
        if (error.response) {
          console.log(error.response)
        } else if (error.request) {
          console.log(error.request)
        } else {
          console.log('Error', error.message)
        }
      })
  },
  getUser (params:any) {
    return api().get('secUser/' + params.id).then(resp => {
       // this.submitting = false
      console.log(resp)
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response)
        } else if (error.request) {
          console.log(error.request)
        } else {
          console.log('Error', error.message)
        }
      })
  },
  deleteUser (id:number) {
    return api().delete('user/' + id)
      .catch((error) => {
        if (error.response) {
          console.log(error.response)
        } else if (error.request) {
          console.log(error.request)
        } else {
          console.log('Error', error.message)
        }
      })
  },

  getUserByUserName(username: string) {
    return userLogin.query().where('username', username).first();
  },
}

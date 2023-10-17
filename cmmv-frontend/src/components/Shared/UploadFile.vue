<template>
 <q-form @submit="onSubmit" class="q-gutter-md">
  <div class="q-pa-md">
    <q-file
          v-model="file"
            name="poster_file"
          label="Carregar Ficheiro"
          square
          flat
          outlined
          use-chips
          clearable
          accept=".csv,.txt,.xls,.xlsx,.doc,.docx,.pdf,.dbf,.zip,.rar,.7z,.jpg,.png,.gif"
          max-file-size="5120000"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>
  </div>
          <div>
        <q-btn label="Carregar" type="submit" color="primary"  :loading="submitting"/>
      </div>
       <view-docs :showDownload=false />
       </q-form>
</template>
<script>
import { ref } from 'vue'
import InfoDocsOrImages from '../../store/models/dorcOrImages/InfoDocsOrImages'
import { QSpinnerIos } from 'quasar'
export default {
  data () {
    return {
      file: ref(null)
    }
  },
    methods: {
           onSubmit () {
             if (this.file !== null) {
                 this.$q.loading.show({
          spinner: QSpinnerIos,
          message: 'Gravando o Documento. Por favor, aguarde...'
        })
                this.submitting = true
            // doc.title =this.file.name
         //   doc.createdDate = this.file.lastModifiedDate
         //   doc.publishedDate = this.file.lastModifiedDate
       //  console.log(this.formData)
        const formData = new FormData()
        formData.append('title', this.file.name)
    //    formData.append('createdDate', doc.createdDate)
    //    formData.append('publishedDate', doc.publishedDate)
        formData.append('forMobilizer', true)
        formData.append('blop', this.file)
                 InfoDocsOrImages.api().post('/infoDocsOrImages', formData).then(resp => {
              //  offset = offset + 100
                console.log(resp.response.data)
                 this.submitting = false
                this.$q.notify({
              message: 'Documento carregado com sucesso.',
              color: 'teal'
          })
          this.file = null
          this.$q.loading.hide()
            }).catch(error => {
                 this.$q.loading.hide()
                console.log(error)
            })
            } else {
              this.$q.notify({
              message: 'Escolha o Documento e depois Submeta',
              color: 'red'
          })
            }
       // data.push(this.file)

       // submitResult.value = data
       // submitEmpty.value = data.length === 0
      }
    },
     components: {
     'view-docs': require('components/Home/MaterialEducativo.vue').default
    }
}
</script>

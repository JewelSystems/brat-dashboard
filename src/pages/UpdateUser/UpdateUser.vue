<template>
  <div v-if="id">
    <Widget 
      title="<h5>Suas <span class='fw-semi-bold'>Informações</span></h5>"
      customHeader>
      
        <!-- Modal Loading -->
        <b-modal 
          id='update-field' 
          :title=selectedField
          centered
          ok-variant="dark"
          ok-only
          ok-title="Cancelar"
          class="mx-auto bg-info">
            <p class="my-4"> {{currentField}} </p>
            <p class="my-4"> {{newField}} </p>

        </b-modal>

        <div class="table-resposive">
          <table class="table">
            <thead>
              <tr>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Nome</td>
                <td>{{first_name}}</td>
                <td><b-button @click="updateField('Nome')" variant="dark">Editar</b-button></td>
              </tr>
              <tr>
                <td>Sobrenome</td>
                <td>{{last_name}}</td>
                <td><b-button @click="updateField('Sobrenome')" variant="dark">Editar</b-button></td>
              </tr>
              <tr>
                <td>Usuário</td>
                <td>{{username}}</td>
              </tr>
              <tr class="align-middle">
                <td>Senha</td>
                <td>********</td>
                <!--<td><b-button @click="updatePassword()" variant="dark">Editar</b-button></td>-->
              </tr>
              <tr>
                <td>Email</td>
                <td>{{email}}</td>
                <td><b-button @click="updateField('Email')" variant="dark">Editar</b-button></td>
              </tr>
              <tr>
                <td>Telefone</td>
                <td>{{phone_number}}</td>
                <td><b-button @click="updateField('Telefone')" variant="dark">Editar</b-button></td>
              </tr>
              <tr>
                <td>Link da transmissão</td>
                <td>{{stream_link}}</td>
                <td><b-button @click="updateField('Link da transmissão')" variant="dark">Editar</b-button></td>
              </tr>
              <tr>
                <td>Twitch</td>
                <td>{{twitch}}</td>
                <td><b-button @click="updateField('Twitch')" variant="dark">Editar</b-button></td>
              </tr>
              <tr>
                <td>Twitter</td>
                <td>{{twitter}}</td>
                <td><b-button @click="updateField('Twitter')" variant="dark">Editar</b-button></td>
              </tr>
              <tr>
                <td>Facebook</td>
                <td>{{facebook}}</td>
                <td><b-button @click="updateField('Facebook')" variant="dark">Editar</b-button></td>
              </tr>
              <tr>
                <td>Instagram</td>
                <td>{{instagram}}</td>
                <td><b-button @click="updateField('Instagram')" variant="dark">Editar</b-button></td>
              </tr>
              <tr>
                <td>Youtube</td>
                <td>{{youtube}}</td>
                <td><b-button @click="updateField('Youtube')" variant="dark">Editar</b-button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Widget>
  </div>
  <div v-else>
    <Error/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Widget from '../../components/Widget/Widget.vue';
import Error from '../Error/Error'
export default {
  name: 'UpdateUser',
  components: { 
    Widget,
    Error
  },
  data() {
      return{
        selectedField: '',
        currentField: '',
        newField: ''
      }
  },
  methods: {
    updateField(field){
      this.selectedField = 'Atualizar '+ field
      this.currentField = field + ' Atual'
      this.$bvModal.show('update-field');
      console.log('Editar ' + field);
    },
    updateEmail(){
      console.log('editar email');
    },
    updatePassword(){
      console.log('editar senha');
    }
  },
  computed: {
    ...mapState('layout', {
      curReq: state => state.curReq,
      id:state => state.id,
      first_name: state => state.first_name,
      last_name: state => state.last_name,
      username: state => state.username,
      email: state => state.email,
      phone_number: state => state.phone_number,
      stream_link: state => state.stream_link,
      twitch: state => state.twitch,
      twitter: state => state.twitter,
      facebook: state => state.facebook,
      instagram: state => state.instagram,
      youtube: state => state.youtube,
    }),
  },
};
</script>


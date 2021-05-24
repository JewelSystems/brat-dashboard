<template>
  <div v-if="id">
    <Widget 
      title="<h5>Suas <span class='fw-semi-bold'>Informações</span></h5>"
      customHeader>
        <!--
        <div>Nome: {{this.first_name}}</div>
        <div>Sobrenome: {{this.last_name}}</div>
        <div>Usuário: {{this.username}}</div>
        <div>Email: {{this.email}}</div>
        <div>Telefone: {{this.phone_number}}</div>
        <div>Link da transmissão: {{stream_link}}</div>
        <div>Twitch: {{twitch}}</div>
        <div>Twitter: {{twitter}}</div>
        <div>Facebook: {{facebook}}</div>
        <div>Instagram: {{instagram}}</div>
        <div>Youtube: {{youtube}}</div>
        -->
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
              </tr>
              <tr>
                <td>Sobrenome</td>
                <td>{{last_name}}</td>
              </tr>
              <tr>
                <td>Usuário</td>
                <td>{{username}}</td>
              </tr>
              <tr class="align-middle">
                <td>Senha</td>
                <td>********</td>
                <td><b-button @click="updatePassword()" variant="dark">Editar</b-button></td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{{email}}</td>
                <td><b-button @click="updateEmail()" variant="dark">Editar</b-button></td>
              </tr>
              <tr>
                <td>Telefone</td>
                <td>{{phone_number}}</td>
              </tr>
              <tr>
                <td>Link da transmissão</td>
                <td>{{stream_link}}</td>
                <td><b-button @click="updateEmail()" variant="dark">Editar</b-button></td>
              </tr>
              <tr>
                <td>Twitch</td>
                <td>{{twitch}}</td>
                <td><b-button @click="updateEmail()" variant="dark">Editar</b-button></td>
              </tr>
              <tr>
                <td>Twitter</td>
                <td>{{twitter}}</td>
                <td><b-button @click="updateEmail()" variant="dark">Editar</b-button></td>
              </tr>
              <tr>
                <td>Facebook</td>
                <td>{{facebook}}</td>
                <td><b-button @click="updateEmail()" variant="dark">Editar</b-button></td>
              </tr>
              <tr>
                <td>Instagram</td>
                <td>{{instagram}}</td>
                <td><b-button @click="updateEmail()" variant="dark">Editar</b-button></td>
              </tr>
              <tr>
                <td>Youtube</td>
                <td>{{youtube}}</td>
                <td><b-button @click="updateEmail()" variant="dark">Editar</b-button></td>
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

      }
  },
  methods: {
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


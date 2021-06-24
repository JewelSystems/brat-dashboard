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
          ok-title="Editar"
          @ok="handleOk"
          cancel-title="Cancelar"
          cancel-variant="dark"
          class="mx-auto bg-info">
            <p class="my-4"> {{fieldValue}} Atual: {{currentValue}} </p>
            <p class="my-4"> Novo {{ fieldValue }}: </p>
            <input id="newFieldValue"
                  v-model="newFieldValue" 
                  v-bind:class="{ invalid: error !== '' }"
                  ref="newFieldValue"
                  class="form-control input-transparent pl-3"
                  type="text"
                  required
                  placeholder=""/>
              <small v-show="error" class="errormsg"> {{ error ? error : "" }} </small>
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
                <td><b-button @click="updateField('Nome', first_name, 'first_name')" variant="dark">Editar</b-button></td>
              </tr>
              <tr>
                <td>Sobrenome</td>
                <td>{{last_name}}</td>
                <td><b-button @click="updateField('Sobrenome', last_name, 'last_name')" variant="dark">Editar</b-button></td>
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
                <td><b-button @click="updateField('Email', email, 'email')" variant="dark">Editar</b-button></td>
              </tr>
              <tr>
                <td>Telefone</td>
                <td>{{phone_number}}</td>
                <td><b-button @click="updateField('Telefone', phone_number, 'phone_number')" variant="dark">Editar</b-button></td>
              </tr>
              <tr>
                <td>Link da transmissão</td>
                <td>{{stream_link}}</td>
                <td><b-button @click="updateField('Link da transmissão', stream_link, 'stream_link')" variant="dark">Editar</b-button></td>
              </tr>
              <tr>
                <td>Twitch</td>
                <td>{{twitch}}</td>
                <td><b-button @click="updateField('Twitch', twitch, 'twitch')" variant="dark">Editar</b-button></td>
              </tr>
              <tr>
                <td>Twitter</td>
                <td>{{twitter}}</td>
                <td><b-button @click="updateField('Twitter', twitter, 'twitter')" variant="dark">Editar</b-button></td>
              </tr>
              <tr>
                <td>Facebook</td>
                <td>{{facebook}}</td>
                <td><b-button @click="updateField('Facebook', facebook, 'facebook')" variant="dark">Editar</b-button></td>
              </tr>
              <tr>
                <td>Instagram</td>
                <td>{{instagram}}</td>
                <td><b-button @click="updateField('Instagram', instagram, 'instagram')" variant="dark">Editar</b-button></td>
              </tr>
              <tr>
                <td>Youtube</td>
                <td>{{youtube}}</td>
                <td><b-button @click="updateField('Youtube', youtube, 'youtube')" variant="dark">Editar</b-button></td>
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
        fieldValue: '',
        currentValue: '',
        newFieldValue: '',
        selectedField: '',
        field: '',

        error: ''
      }
  },
  methods: {
    updateField(fieldValue, value, field){
      this.error = '';
      this.currentValue = value;
      this.fieldValue = fieldValue;
      this.selectedField = 'Atualizar '+ fieldValue;
      this.$bvModal.show('update-field');
      this.field = field;
    },
    updatePassword(){
      console.log('editar senha');
    },
    validateInput(){
      const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //xxx@xxx.com.xx
      const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)/; //http://xxxx.xx

      this.error = '';
      if(!this.newFieldValue || this.newFieldValue.length <= 0){
        this.error = 'Campo obrigatório';
        return false;
      }
      if(this.field === 'first_name' && /^\s*$/.test(this.newFieldValue)) {
        this.error = 'Campo obrigatório';
        return false;
      }
      if(this.field === 'last_name' && /^\s*$/.test(this.newFieldValue)) {
        this.error = 'Campo obrigatório';
        return false;
      }
      if(this.field === 'email' && !emailRegex.test(this.newFieldValue)) {
        this.error = 'Email inválido';
        return false;
      }
      if(this.field === 'phone_number' && (/[a-zA-Z]/g.test(this.newFieldValue) ||this.newFieldValue.length > 25)) {
        this.error = 'Telefone inválido';
        return false;
      }
      if(this.field === 'stream_link' && !urlRegex.test(this.newFieldValue)) {
        this.error = 'Informe o endereço completo (ex: https://www.twitch.tv/)';
        return false;
      }
      if(this.field === 'twitch' && !urlRegex.test(this.newFieldValue)) {
        this.error = 'Informe o endereço completo (ex: https://www.twitch.tv/)';
        return false;
      }
      if(this.field === 'twitter' && !urlRegex.test(this.newFieldValue)) {
        this.error = 'Informe o endereço completo (ex: https://twitter.com/)';
        return false;
      }
      if(this.field === 'facebook' && !urlRegex.test(this.newFieldValue)) {
        this.error = 'Informe o endereço completo (ex: https://www.facebook.com/)';
        return false;
      }
      if(this.field === 'instagram' && !urlRegex.test(this.newFieldValue)) {
        this.error = 'Informe o endereço completo (ex: https://www.instagram.com/)';
        return false;
      }
      if(this.field === 'youtube' && !urlRegex.test(this.newFieldValue)) {
        this.error = 'Informe o endereço completo (ex: https://www.youtube.com/)';
        return false;
      }
      
      this.error = '';
      return true;
    },
    update(){
      if(this.validateInput()){
        let wsPayload = `{"endpoint":"updateUser", "id":${this.curReq}, "info":{"user_id": ${this.id},"${this.field}": "${this.newFieldValue}"}}`;
        this.$store.commit('layout/SOCKET_SEND', JSON.parse(wsPayload));
        this.fieldValue = '';
        this.currentValue = '';
        this.newFieldValue = '';
        this.selectedField = '';
        this.field = '';
        
        this.$nextTick(() => {
          this.$bvModal.hide('update-field');
        })
      }
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.update()
    },
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


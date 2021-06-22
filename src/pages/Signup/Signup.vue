<template>
  <div class="auth-page" id="app">
    <b-container>
      <Widget class="widget-auth mx-auto" title="<h3 class='mt-0'>Cadastro</h3>" customHeader>
        <p class="widget-auth-info">
          Cadastre sua conta!
        </p>
        <form autocomplete="off" novalidate class="mt" @submit.prevent="submit">

          <b-form-group label="" label-for="first_name">
            <b-input-group>
              <b-input-group-text slot="prepend"><i class="la la-user text-white"></i></b-input-group-text>
              <input id="first_name"
                     v-model="form.first_name" 
                     v-bind:class="{ invalid: errors.first_name !== null }"
                     ref="first_name"
                     class="form-control input-transparent pl-3"
                     type="text"
                     required
                     placeholder="Nome"/>
              <i v-show="errors.first_name" class="la la-exclamation-circle errorspan"></i>
            </b-input-group>
            <small v-show="errors.first_name" class="errormsg"> {{ errors.first_name ? errors.first_name.split(":")[1] : "" }} </small>
          </b-form-group>

          <b-form-group label="" label-for="last_name">
            <b-input-group>
              <b-input-group-text slot="prepend"><i class="la la-user text-white"></i></b-input-group-text>
              <input id="last_name"
                     v-model="form.last_name" 
                     v-bind:class="{ invalid: errors.last_name !== null }"
                     ref="last_name"
                     class="form-control input-transparent pl-3"
                     type="text"
                     required
                     placeholder="Sobrenome"/>
              <i v-show="errors.last_name" class="la la-exclamation-circle errorspan"></i>
            </b-input-group>
            <small v-show="errors.first_name" class="errormsg"> {{ errors.last_name ? errors.last_name.split(":")[1] : "" }} </small>
          </b-form-group>
          
          <b-form-group label="" label-for="username">
            <b-input-group>
              <b-input-group-text slot="prepend"><i class="la la-user text-white"></i></b-input-group-text>
              <input id="username"
                     v-model="form.username" 
                     v-bind:class="{ invalid: errors.username !== null }"
                     ref="username"
                     class="form-control input-transparent pl-3"
                     type="text"
                     required
                     placeholder="Usuário"/>
              <i v-show="errors.username" class="la la-exclamation-circle errorspan"></i>
            </b-input-group>
            <small v-show="errors.username" class="errormsg"> {{ errors.username ? errors.username.split(":")[1] : "" }} </small>
          </b-form-group>

          <b-form-group label="" label-for="nickname">
            <b-input-group>
              <b-input-group-text slot="prepend"><i class="la la-user text-white"></i></b-input-group-text>
              <input id="nickname"
                     v-model="form.nickname" 
                     v-bind:class="{ invalid: errors.nickname !== null }"
                     ref="nickname"
                     class="form-control input-transparent pl-3"
                     type="text"
                     required
                     placeholder="Nickname"/>
              <i v-show="errors.nickname" class="la la-exclamation-circle errorspan"></i>
            </b-input-group>
            <small v-show="errors.nickname" class="errormsg"> {{ errors.nickname ? errors.nickname.split(":")[1] : "" }} </small>
          </b-form-group>


          <b-form-group label="" label-for="email">
            <b-input-group>
              <b-input-group-text slot="prepend"><i class="la la-user text-white"></i></b-input-group-text>
              <input id="email"
                     v-model="form.email" 
                     v-bind:class="{ invalid: errors.email !== null }"
                     ref="email"
                     class="form-control input-transparent pl-3"
                     type="text"
                     required
                     placeholder="E-mail"/>
              <i v-show="errors.email" class="la la-exclamation-circle errorspan"></i>
            </b-input-group>
            <small v-show="errors.email" class="errormsg"> {{ errors.email ? errors.email.split(":")[1] : "" }} </small>
          </b-form-group>
          
          <b-form-group label="Gênero" v-slot="{ ariaDescribedby }">
            <b-form-radio-group
              v-model="form.gender"
              :options="genderOptions"
              :aria-describedby="ariaDescribedby"
              name="radio-inline"
            ></b-form-radio-group>
          </b-form-group>

          <b-form-group label="Data de nascimento" label-for="birthday">
            <b-input-group>
              <b-input-group-text slot="prepend"><i class="la la-calendar text-white"></i></b-input-group-text>
              <input id="birthday"
                     v-model="form.birthday" 
                     v-bind:class="{ invalid: errors.birthday !== null }"
                     ref="birthday"
                     class="form-control input-transparent pl-3"
                     type="date"
                     required
                     placeholder="Data de Nascimento"/>
              <i v-show="errors.birthday" class="la la-exclamation-circle errorspan"></i>
            </b-input-group>
            <small v-show="errors.birthday" class="errormsg"> {{ errors.birthday ? errors.birthday.split(":")[1] : "" }} </small>
          </b-form-group>

          <b-form-group label="" label-for="phone_number">
            <b-input-group>
              <b-input-group-text slot="prepend"><i class="la la-phone text-white"></i></b-input-group-text>
              <input id="phone_number"
                     v-model="form.phone_number" 
                     v-bind:class="{ invalid: errors.phone_number !== null }"
                     ref="phone_number"
                     class="form-control input-transparent pl-3"
                     type="text"
                     required
                     placeholder="Número de telefone"/>
                     <!--
                     v-mask="'+##(##)#####-####'"
                     placeholder="+__(__)_____-____"/>
                     -->
              <i v-show="errors.phone_number" class="la la-exclamation-circle errorspan"></i>
            </b-input-group>
            <small v-show="errors.phone_number" class="errormsg"> {{ errors.phone_number ? errors.phone_number.split(":")[1] : "" }} </small>
          </b-form-group>

          <b-form-group label="" label-for="password1">
            <b-input-group>
              <b-input-group-text slot="prepend"><i class="la la-lock text-white"></i></b-input-group-text>
              <input id="password1"
                     v-model="form.password1" 
                     v-bind:class="{ invalid: errors.password1 !== null }"
                     ref="password1"
                     class="form-control input-transparent pl-3"
                     type="password"
                     required
                     placeholder="Senha"/>
              <i v-show="errors.password1" class="la la-exclamation-circle errorspan"></i>
            </b-input-group>
            <small v-show="errors.password1" class="errormsg"> {{ errors.password1 ? errors.password1.split(":")[1] : "" }} </small>
          </b-form-group>

          <b-form-group label="" label-for="password2">
            <b-input-group>
              <b-input-group-text slot="prepend"><i class="la la-lock text-white"></i></b-input-group-text>
              <input id="password2"
                     v-model="form.password2" 
                     v-bind:class="{ invalid: errors.password2 !== null }"
                     ref="password2"
                     class="form-control input-transparent pl-3"
                     type="password"
                     required
                     placeholder="Confirmar Senha"/>
              <i v-show="errors.password2" class="la la-exclamation-circle errorspan"></i>
            </b-input-group>
            <small v-show="errors.password2" class="errormsg"> {{ errors.password2 ? errors.password2.split(":")[1] : "" }} </small>
          </b-form-group>

          <b-form-group label="" label-for="stream_link">
            <b-input-group>
              <b-input-group-text slot="prepend"><i class="la la-link text-white"></i></b-input-group-text>
              <input id="stream_link"
                     v-model="form.stream_link" 
                     v-bind:class="{ invalid: errors.stream_link !== null }"
                     ref="stream_link"
                     class="form-control input-transparent pl-3"
                     type="text"
                     required
                     placeholder="Link da Transmissão"/>
              <i v-show="errors.stream_link" class="la la-exclamation-circle errorspan"></i>
            </b-input-group>
            <small v-show="errors.stream_link" class="errormsg"> {{ errors.stream_link ? errors.stream_link.split(": ")[1] : "" }} </small>
          </b-form-group>

          <h6>
            Redes Sociais
            <br>
            <small>Opcionais</small>
          </h6>
          
          <b-form-group label="" label-for="twitch">
            <b-input-group>
              <b-input-group-text slot="prepend"><i class="la la-twitch text-white"></i></b-input-group-text>
              <input id="twitch"
                     v-model="form.twitch" 
                     v-bind:class="{ invalid: errors.twitch !== null }"
                     ref="twitch"
                     class="form-control input-transparent pl-3"
                     type="text"
                     required
                     placeholder="Twitch"/>
              <i v-show="errors.twitch" class="la la-exclamation-circle errorspan"></i>
            </b-input-group>
            <small v-show="errors.twitch" class="errormsg"> {{ errors.twitch ? errors.twitch.split(": ")[1] : "" }} </small>
          </b-form-group>

          <b-form-group label="" label-for="twitter">
            <b-input-group>
              <b-input-group-text slot="prepend"><i class="la la-twitter text-white"></i></b-input-group-text>
              <input id="twitter"
                     v-model="form.twitter" 
                     v-bind:class="{ invalid: errors.twitter !== null }"
                     ref="twitter"
                     class="form-control input-transparent pl-3"
                     type="text"
                     required
                     placeholder="Twitter"/>
              <i v-show="errors.twitter" class="la la-exclamation-circle errorspan"></i>
            </b-input-group>
            <small v-show="errors.twitter" class="errormsg"> {{ errors.twitter ? errors.twitter.split(": ")[1] : "" }} </small>
          </b-form-group>

          <b-form-group label="" label-for="facebook">
            <b-input-group>
              <b-input-group-text slot="prepend"><i class="la la-facebook text-white"></i></b-input-group-text>
              <input id="facebook"
                     v-model="form.facebook" 
                     v-bind:class="{ invalid: errors.facebook !== null }"
                     ref="facebook"
                     class="form-control input-transparent pl-3"
                     type="text"
                     required
                     placeholder="Facebook"/>
              <i v-show="errors.facebook" class="la la-exclamation-circle errorspan"></i>
            </b-input-group>
            <small v-show="errors.facebook" class="errormsg"> {{ errors.facebook ? errors.facebook.split(": ")[1] : "" }} </small>
          </b-form-group>

          <b-form-group label="" label-for="instagram">
            <b-input-group>
              <b-input-group-text slot="prepend"><i class="la la-instagram text-white"></i></b-input-group-text>
              <input id="instagram"
                     v-model="form.instagram" 
                     v-bind:class="{ invalid: errors.instagram !== null }"
                     ref="instagram"
                     class="form-control input-transparent pl-3"
                     type="text"
                     required
                     placeholder="Instagram"/>
              <i v-show="errors.instagram" class="la la-exclamation-circle errorspan"></i>
            </b-input-group>
            <small v-show="errors.instagram" class="errormsg"> {{ errors.instagram ? errors.instagram.split(": ")[1] : "" }} </small>
          </b-form-group>

          <b-form-group label="" label-for="youtube">
            <b-input-group>
              <b-input-group-text slot="prepend"><i class="la la-youtube text-white"></i></b-input-group-text>
              <input id="youtube"
                     v-model="form.youtube" 
                     v-bind:class="{ invalid: errors.youtube !== null }"
                     ref="youtube"
                     class="form-control input-transparent pl-3"
                     type="text"
                     required
                     placeholder="Youtube"/>
              <i v-show="errors.youtube" class="la la-exclamation-circle errorspan"></i>
            </b-input-group>
            <small v-show="errors.youtube" class="errormsg"> {{ errors.youtube ? errors.youtube.split(": ")[1] : "" }} </small>
          </b-form-group>

          <div id="error-block" v-show="errorMessage"></div>

          <div class="bg-widget auth-widget-footer">
            <b-button type="submit" variant="primary" class="auth-btn" size="sm">
              <span class="auth-btn-circle">
                <i class="la la-caret-right"></i>
              </span>
              Cadastrar
            </b-button>
            <router-link class="d-block text-center mb-4" to="login">Voltar</router-link>
          </div>
        </form>
      </Widget>
    </b-container>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget';
import UserService from '@/service/UserService'

export default {
  name: 'SignupPage',
  components: { Widget },
  data() {
    return {
      errorMessage: null,
      genderOptions: [
        { text: 'Masculino', value: 'M' },
        { text: 'Feminino', value: 'F' },
        { text: 'Não-Binário', value: 'N' },
        { text: 'Outro', value: 'O' }
      ],
      form:{ 
        /*
        first_name: 'Vitor',
        last_name: 'Hardoim',
        username: 'vitorch',
        nickname: 'Ranzo',
        email: 'vitor@gmail.com',
        gender: 'M',
        birthday: '1997-05-26',
        phone_number: '21989604160',
        password1: '12345678',
        password2: '12345678',
        stream_link: 'https://www.twitch.tv/yoda',
        twitch: 'https://www.twitch.tv/',
        twitter: 'https://twitter.com/',
        facebook: 'https://www.facebook.com/',
        instagram: 'https://www.instagram.com/',
        youtube: 'https://www.youtube.com/',
        twitch: 'https://www.twitch.tv/yoda',
        twitter: 'https://twitter.com/StoneDYooDa',
        facebook: 'https://www.facebook.com/Stoneyoda/',
        instagram: 'https://www.instagram.com/stonedyoda/?hl=pt-br',
        youtube: 'https://www.youtube.com/channel/UCuhVlANZXUATGv1dRmwcUzA',
        */

        first_name: '',
        last_name: '',
        username: '',
        nickname: '',
        email: '',
        gender: 'M',
        birthday: '',
        phone_number: '',
        password1: '',
        password2: '',
        stream_link: '',
        twitch: 'https://www.twitch.tv/',
        twitter: 'https://twitter.com/',
        facebook: 'https://www.facebook.com/',
        instagram: 'https://www.instagram.com/',
        youtube: 'https://www.youtube.com/',
      },
      errors: {
        first_name: null,
        last_name: null,
        username: null,
        nickname: null,
        email: null,
        birthday: null,
        phone_number: null,
        password1: null,
        password2: null,
        stream_link: null,
        twitch: null,
        twitter: null,
        facebook: null,
        instagram: null,
        youtube: null,
      }
    };
  },
  methods: {
    async submit() {
        if(this.inputValidation()){
            if(this.form.twitch === '') this.form.twitch = 'https://www.twitch.tv/';
            if(this.form.twitter === '') this.form.twitter = 'https://twitter.com/';
            if(this.form.facebook === '') this.form.facebook = 'https://www.facebook.com/';
            if(this.form.instagram === '') this.form.instagram = 'https://www.instagram.com/';
            if(this.form.youtube === '') this.form.youtube = 'https://www.youtube.com/';
          const response = await UserService.postSignup(
            this.form.first_name,
            this.form.last_name,
            this.form.username,
            this.form.nickname,
            this.form.email,
            this.form.password1,
            this.form.gender,
            this.form.birthday,
            this.form.phone_number,
            this.form.stream_link,
            this.form.twitch,
            this.form.twitter,
            this.form.facebook,
            this.form.instagram,
            this.form.youtube);

          if(response.data.error === "Username already exists"){
            this.errorMessage = 'Os seguintes campos estão inválidos: ';
            this.errors.username = "Usuário: Nome de usuário já existe"
            this.errorMessage += `<br><small><i class="fa fa-circle"></i></small> ` + this.errors.username;
            document.getElementById('error-block').innerHTML = `<div role="alert" aria-live="polite" aria-atomic="true" class="alert alert-sm alert-danger">${this.errorMessage}</div>`;
          }else{
            this.$router.push('/login');
          }
        }else{
          document.getElementById('app').scrollIntoView();
        }
    },
    inputValidation(){
      let validationCheck = true;
      const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //xxx@xxx.com.xx
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/; //yyyy-mm-dd
      const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)/; //http://xxxx.xx
      
      for(let element in this.errors){
        this.errors[element] = null;
      }

      if(!this.form.first_name || /^\s*$/.test(this.form.first_name)) {
        this.errors.first_name = 'Nome: Campo obrigatório';
        validationCheck = false
      }
      if(!this.form.last_name || /^\s*$/.test(this.form.last_name)) {
        this.errors.last_name = 'Sobrenome: Campo obrigatório';
        validationCheck = false
      }
      if(!this.form.username || /^\s*$/.test(this.form.username)) {
        this.errors.username = 'Usuário: Campo obrigatório';
        validationCheck = false
      }
      if(!this.form.nickname || /^\s*$/.test(this.form.nickname)) {
        this.errors.nickname = 'Nickname: Campo obrigatório';
        validationCheck = false
      }
      if(!this.form.email || !emailRegex.test(this.form.email)) {
        this.errors.email = 'E-mail: E-mail Inválido';
        validationCheck = false
      }
      if(!this.form.birthday || !dateRegex.test(this.form.birthday)) {
        this.errors.birthday = 'Data de nascimento: Valor inválido';
        validationCheck = false
      }
      if(!this.form.phone_number || this.form.phone_number.length > 25 /*|| this.form.phone_number.length < 16*/) {
        this.errors.phone_number = 'Telefone: Número inválido';
        validationCheck = false
      } 
      if(!this.form.password1 || this.form.password1.length < 8) {
        this.errors.password1 = 'Senha: Senha precisa ter no mínimo 8 caracteres';
        validationCheck = false
      }else if(!this.form.password2 || this.form.password2.length < 8) {
        this.errors.password2 = 'Senha: Confirme sua senha!';
        validationCheck = false
      }else if(this.form.password1 !== this.form.password2) {
        this.errors.password2 = 'Senha: As senhas são diferentes!';
        validationCheck = false
      } 
      if((this.form.stream_link && !urlRegex.test(this.form.stream_link)) || this.form.stream_link.length <= 0){
        this.errors.stream_link = 'Transmissão: Informe o endereço completo (https://www.twitch.tv/)';
        validationCheck = false
      }
      if(this.form.twitch && !urlRegex.test(this.form.twitch)){
        this.errors.twitch = "Twitch: Informe o endereço completo (https://www.twitch.tv/)";
        validationCheck = false
      }
      if(this.form.twitter && !urlRegex.test(this.form.twitter)){
        this.errors.twitter = 'Twitter: Informe o endereço completo (https://twitter.com/)';
        validationCheck = false
      }
      if(this.form.facebook && !urlRegex.test(this.form.facebook)){
        this.errors.facebook = 'Facebook: Informe o endereço completo (https://www.facebook.com/)';
        validationCheck = false
      }
      if(this.form.instagram && !urlRegex.test(this.form.instagram)){
        this.errors.instagram = 'Instagram: Informe o endereço completo (https://www.instagram.com/)';
        validationCheck = false
      }
      if(this.form.youtube && !urlRegex.test(this.form.youtube)){
        this.errors.youtube = 'Youtube: Informe o endereço completo (https://www.youtube.com/)';
        validationCheck = false
      }
      
      if (!validationCheck){
        this.errorMessage = 'Os seguintes campos estão inválidos: ';
        for(let error in this.errors){
          if(this.errors[error]) this.errorMessage = this.errorMessage + `<br><small><i class="fa fa-circle"></i></small> ` + this.errors[error];
        }
        document.getElementById('error-block').innerHTML = `<div role="alert" aria-live="polite" aria-atomic="true" class="alert alert-sm alert-danger">${this.errorMessage}</div>`;
      }

      return validationCheck;
    },
  },
};
</script>

<style>
input.invalid{
  border-color: #800000;
  border-width: 3px;
  z-index: 3;
}

.errorspan {
  float: right;
  position: absolute;
  z-index: 2;
  color: red;
  top: 14px;
  left: 310px;
}
.errormsg {
  color: red
}


</style>
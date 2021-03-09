<template>
  <div class="auth-page">
    <b-container>
      <Widget class="widget-auth mx-auto" title="<h3 class='mt-0'>Login</h3>" customHeader>
        <p class="widget-auth-info">
          Use seu usuário para logar.
        </p>
        <form novalidate class="mt" @submit.prevent="login">
          <b-alert class="alert-sm" variant="danger" :show="!!errorMessage">
            {{errorMessage}}
          </b-alert>
          <b-form-group label="Usuário" label-for="username">
            <b-input-group>
              <b-input-group-text slot="prepend"><i class="la la-user text-white"></i></b-input-group-text>
              <input id="username"
                     v-model="form.username" 
                     ref="username"
                     class="form-control input-transparent pl-3"
                     type="text"
                     required
                     placeholder="Usuário"/>
            </b-input-group>
          </b-form-group>
          <b-form-group label="Senha" label-for="password">
            <b-input-group>
              <b-input-group-text slot="prepend"><i class="la la-lock text-white"></i></b-input-group-text>
              <input id="password"
                     v-model="form.password" 
                     ref="password"
                     class="form-control input-transparent pl-3"
                     type="password"
                     required
                     placeholder="Senha"/>
            </b-input-group>
          </b-form-group>
          <div class="bg-widget auth-widget-footer">
            <b-button type="submit" variant="primary" class="auth-btn" size="sm">
              <span class="auth-btn-circle">
                <i class="la la-caret-right"></i>
              </span>
              Login
            </b-button>
            <p class="widget-auth-info mt-4">
              Não tem uma conta? Crie uma agora!
            </p>
            <router-link class="d-block text-center mb-4" to="signup">Criar conta</router-link>
            <!--
            <div class="social-buttons">
              <b-button variant="primary" class="social-button">
                <i class="social-icon social-google"></i>
                <p class="social-text">GOOGLE</p>
              </b-button>
              <b-button variant="success" class="social-button">
                <i class="social-icon social-microsoft"></i>
                <p class="social-text">MICROSOFT</p>
              </b-button>
            </div>
            -->
          </div>
        </form>
      </Widget>
    </b-container>
    <footer class="auth-footer">
      Light Blue Admin Theme by <a href="https://flatlogic.com" target="_blank">Flatlogic</a>, Dashboard developed by Jewel Systems
    </footer>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget';
//import AuthService from '@/service/AuthService'
import { mapActions, mapState } from 'vuex';
//import store from '../../store'

export default {
  name: 'LoginPage',
  components: { Widget },
  data() {
    return {
      form:{
        /*
        username: 'admin',
        password: '12345678',
        */
        
        username: '',
        password: '',
      },
      errorMessage: null,
    };
  },
  methods: {
    ...mapActions(
      'layout', ['authLogin'],
    ),
    async login() {
      this.errorMessage = null;
      
      const validateUsername = this.form.username.length > 0;
      const validatePword = this.form.password.length >= 8;

      if(!validateUsername){
        this.errorMessage = "Por favor, preecha seu nome de usuário.";
        if(!validatePword){
          this.errorMessage = "Por favor, preencha os campos abaixo.";
        }
      }
      else if(!validatePword){
        this.errorMessage = "Por favor, preencha sua senha."
      }else{
        //HTTP Login
        const payload = {username: this.form.username, password: this.form.password}
        await this.$store.dispatch('layout/authLogin', payload);

        if(this.authError){
          this.errorMessage = "Senha incorreta";
        }else{
          //WS Login
          //this.$store.dispatch('createWS');
          const wsPayload = {"endpoint":"login", "id":this.curReq, "info":{"token": this.authToken}};
          this.$store.commit('layout/SOCKET_SEND', wsPayload);
        }
      }
    },
  },
  computed: {
    ...mapState('layout', {
      authToken: state => state.authToken,
      authenticate: state => state.authenticate,
      curReq: state => state.curReq,
      authError: state =>state.authError
    }),
  },
};
</script>

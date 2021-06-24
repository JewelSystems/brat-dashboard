<template>
<div>
  <router-view />
  <b-modal id='server-modal' title="Servidor de websocket desconectado">
    <p class="my-4">Servidor de websocket desconectado, por favor, recarregar a página.</p>
  </b-modal>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import AuthService from './service/AuthService';
export default {
  name: 'App',
  methods:{
    ...mapActions(
      'layout', ['loadUser'],
    ),
  },
  watch:{
    wsState: function(){
      if(this.wsState === 3){
        this.$bvModal.show('server-modal');
        this.$store.commit('layout/wsState', -1);
      }
    }
  },
  async created() {
    const currentPath = this.$router.history.current.path;
    //console.log(this.wsState);

    if (window.localStorage.getItem('authenticated') === 'true' && window.localStorage.getItem('curUser')) {
      let response = await AuthService.checkToken(window.localStorage.getItem('token'));
      if(response.status === 200){
        await this.loadUser(window.localStorage.getItem('curUser'));
        const wsPayload = {"endpoint":"login", "id":this.curReq, "info":{"token": window.localStorage.getItem('token')}};
        this.$store.commit('layout/SOCKET_SEND', wsPayload);
      }
    }
    if (currentPath === '/') {
      this.$router.push('/login');
    }
  },  
  computed: {
    ...mapState('layout', {
      authToken: state => state.authToken,
      curReq: state => state.curReq,
      wsState: state => state.wsState,
    }),
  },
};
</script>

<style src="./styles/theme.scss" lang="scss" />

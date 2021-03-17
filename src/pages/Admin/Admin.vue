<template>
  <div>
    <h1 class="page-title">Página de Usuários &nbsp;</h1>
    <b-row>
      <b-col>
        <Widget
          title="<h5>Tabela de <span class='fw-semi-bold'>Usuários</span></h5>"
          customHeader
        >
          <div class="table-resposive">
            <table class="table" v-if="this.userList.length !== 0">
              <thead>
                <tr>
                  <th class="hidden-sm-down">#id</th>
                  <th>Nome</th>
                  <th>Sobrenome</th>
                  <th>Usuário</th>
                  <th>Email</th>
                  <th>Permissões</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in this.userList" :key="row.id">
                  <td class="align-middle">{{row.id}}</td>
                  <td class="align-middle">{{row.first_name}}</td>
                  <td class="align-middle">{{row.last_name}}</td>
                  <td class="align-middle">{{row.username}}</td>
                  <td class="align-middle">{{row.email}}</td>

                  <td class="align-middle"><small v-for="permission in row.permissions" :key="permission">
                    <b-badge class='tag' v-if="permission === 'Admin'" variant="success">{{permission}}</b-badge>
                    <b-badge class='tag' v-else-if="permission === 'Tech'" variant="primary">{{permission}}</b-badge>
                    <b-badge class='tag' v-else-if="permission === 'Financ'" variant="danger"> Financeiro </b-badge>
                    <b-badge class='tag' v-else-if="permission === 'Staff-Brat2021-Lead'" variant="warning">Staff</b-badge>
                    <b-badge class='tag' v-else-if="permission === 'Host-Brat2021'" variant="light">Host</b-badge>
                    <b-badge class='tag' v-else-if="permission === 'Runner-Brat2021'" variant="light">Runner</b-badge>
                    <b-badge class='tag' v-else-if="permission === 'Comentarista-Brat2021'" variant="light">Comentarista</b-badge>
                    <b-badge class='tag' v-else-if="permission === ''"></b-badge>
                  </small></td>
                  <td>
                    <router-link :to="`/app/user/${row.id}`"><b-button variant="dark">Visualizar</b-button></router-link>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else>
              Não existe nenhum usuário cadastrado.
            </div>
          
          
          </div>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget';
import { mapState } from 'vuex';
export default {
  name: 'Admin',
  data() {
    return{
    }
  },
  methods: {

  },
  computed: {
    ...mapState('layout', {
      userList: state => state.userList,
      curReq: state => state.curReq
    }),
  },
  components: {
    Widget,
  },
  async created(){
    const wsPayload = {"endpoint":"getUsers", "id":this.curReq};
    this.$store.commit('layout/SOCKET_SEND', wsPayload);
  },
};
</script>

<style>
  .tag{
    margin-right: 5px
  }
</style>
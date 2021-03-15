<template>
  <div>
    <h1 class="page-title">Informações de {{ user.username }} &nbsp;
    </h1>
      <b-row>
        <b-col>
          <Widget 
          title="<h5>Informações do <span class='fw-semi-bold'>Usuário</span></h5>"
          customHeader>
            <div>Nome: {{this.user.first_name}}</div>
            <div>Sobrenome: {{this.user.last_name}}</div>
            <div>Usuário: {{this.user.username}}</div>
            <div>Email: {{this.user.email}}</div>
            <div>
              Permissões: 
              <small v-for="permission in this.user.permissions" :key="permission">
                <b-badge v-if="permission === 'Admin'" variant="success">{{permission}}<a @click="removePermission(permission)"><i class="la la-close"></i></a></b-badge>
                <b-badge v-else-if="permission === 'Tech'" variant="primary">{{permission}}<a @click="removePermission(permission)"><i class="la la-close"></i></a></b-badge>
                <b-badge v-else-if="permission === 'Financ'" variant="danger">{{permission}}<a @click="removePermission(permission)"><i class="la la-close"></i></a></b-badge>
                <b-badge v-else-if="permission === 'Staff-Brat2021-Lead'" variant="warning">{{permission}}<a @click="removePermission(permission)"><i class="la la-close"></i></a></b-badge>
                <b-badge v-else-if="permission === 'None'"></b-badge>
                <b-badge v-else-if="permission === ''"></b-badge>
                <b-badge v-else variant="light">{{permission}}<a @click="removePermission(permission)"><i class="la la-close"></i></a></b-badge>
                <span style="margin-left: 5px"/>
              </small>
            </div>
             
            <div>
              <b-form-select id="runs-dropdown" v-model="selectedPermission" class="md-2" variant="dark">
                    <b-form-select-option :value="null">Selecione uma permissão para adicionar ao usuário.</b-form-select-option>
                    <b-form-select-option 
                    v-for="permission in allPermissions.filter(x => !this.user.permissions.includes(x))" 
                    :key="permission" 
                    :value="permission">
                      {{permission}}
                    </b-form-select-option>
                  </b-form-select>
              <b-button variant="dark" @click="addPermission()">Adicionar Permissão</b-button>
            </div>

            <br>
            <h3>
              Detalhes das permissões:
            </h3>
            <div>Admin: </div>
            <div>Tech: </div>
            <div>Financ: </div>
            <div>Staff-Brat2021-Lead: </div>
            <div>Comentarista-Brat2021: </div>
            <div>Runner-Brat2021: </div>
            <div>Host-Brat2021: </div>
            <div>None: </div>
            
          </Widget>
        </b-col>
      </b-row>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Widget from '../../components/Widget/Widget.vue';
export default {
  components: { Widget },
  name: 'UserView',
  data() {
      return{
        id: String(this.$route.params.id),
        user:  null,
        selectedPermission: '',

        allPermissions: [
          "Admin",
          "Tech",
          "Financ",
          "Staff-Brat2021-Lead",
          "Comentarista-Brat2021",
          "Runner-Brat2021",
          "Host-Brat2021"
        ]
      }
  },
  created(){
     this.user = this.userList.find(element => String(element.id) === this.id);
     //console.log('id: ' + this.curUserId);
  },
  computed: {
    ...mapState('layout', {
      userList: state => state.userList,
      curUserId: state => state.id,
      curReq: state => state.curReq
    }),
  },
  methods: {
    async removePermission(permission){
      const wsPayload = {"endpoint":"removePermission", "id":this.curReq, "info":{"updated_user": this.user.id, "updater_user": this.curUserId, "permission": permission}};
      this.$store.commit('layout/SOCKET_SEND', wsPayload);
    },
    async addPermission(){
      if(this.selectedPermission !== ''){
        const wsPayload = {"endpoint":"addPermission", "id":this.curReq, "info":{"updated_user": this.user.id, "updater_user": this.curUserId, "permission": this.selectedPermission}};
        this.$store.commit('layout/SOCKET_SEND', wsPayload);
        this.selectedPermission = null;
      }
    }
  }
};
</script>


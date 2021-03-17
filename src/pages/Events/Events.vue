<template>
  <div>
    <h1 class="page-title">Página de Eventos &nbsp;</h1>
    <b-row>
      <b-col>
        <Widget
          title="<h5>Tabela de <span class='fw-semi-bold'>Eventos</span></h5>"
          customHeader
        >
          <div class="table-resposive">
            <table class="table" v-if="this.eventsList.length !== 0">
              <thead>
                <tr>
                  <th class="hidden-sm-down">#id</th>
                  <th>Nome</th>
                  <th>Link para doação</th>
                  <th>Início</th>
                  <th>Fim</th>
                  <th>Status</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody id="tableBody">
                <tr v-for="row in this.eventsList" :key="row.id" :id="`row-`+row.id">
                  <td class="align-middle">{{row.id}}</td>
                  <td><input
                    ref="name"
                    class="form-control input-transparent pl-3"
                    type="text"
                    v-model="row.name" 
                  /></td>
                  <td><input
                    ref="donation_link"
                    class="form-control input-transparent pl-3"
                    type="text"
                    v-model="row.donation_link" 
                  /></td>
                  <td><input
                    ref="start"
                    class="form-control input-transparent pl-3"
                    type="date"
                    v-model="row.start" 
                  /></td>
                  <td><input
                    ref="end"
                    class="form-control input-transparent pl-3"
                    type="date"
                    v-model="row.end" 
                  /></td>

                  <td class="align-middle" v-if="row.active === `A`"><b-badge variant="success"> Ativo </b-badge></td>
                  <td class="align-middle" v-else-if="row.active === `N`"><b-badge variant="primary"> Em espera </b-badge></td>
                  <td class="align-middle" v-else-if="row.active === `D`"><b-badge variant="danger"> Desativado </b-badge></td>
                  <td class="align-middle" v-else> Error </td>

                  <td v-if="row.active === `A`"><b-button variant="dark" @click="alterState(row.id)"> Desativar </b-button></td>
                  <td v-else-if="row.active === `N` && eventsList.filter(element => element.active === `A`).length === 0"><b-button variant="dark" @click="alterState(row.id)"> Ativar </b-button></td>
                  <td v-else>  </td>

                  <td><b-button @click="updateEvent(row.id, row.name, row.donation_link, row.start, row.end)" variant="dark">Salvar alterações</b-button></td>
                </tr>
              </tbody>
            </table>
            <div v-else>
              Não existe nenhum evento cadastrado!
            </div>
          </div>
          <div class="clearfix">
            <div class="float-right">
              <b-button @click="toggleCreate" variant="dark">Criar evento</b-button>
            </div>
          </div>
          <div v-show="showCreate">
            <b-row>
              <h4>Novo evento</h4>
            </b-row>
            <b-row style="padding-left: 12px">
              <form novalidate class="mt" @submit.prevent="submit">
                <b-row>
                  <b-col cols=3>
                    <b-form-group label="Nome do evento" label-for="newName">
                      <b-input-group>
                        <input id="newName"
                          v-model="newForm.newName" 
                          v-bind:class="{ invalid: errors.newName !== null }"
                          ref="newName"
                          class="form-control input-transparent pl-3"
                          type="text"
                          required
                          placeholder=""/>
                      </b-input-group>
                      <small v-show="errors.newName" class="errormsg"> {{ errors.newName ? errors.newName : ""}} </small>
                    </b-form-group>
                  </b-col>

                  <b-col cols=3>
                    <b-form-group label="Link para doações" label-for="newDonationLink">
                      <b-input-group>
                        <input id="newDonationLink"
                          v-model="newForm.newDonationLink" 
                          v-bind:class="{ invalid: errors.newDonationLink !== null }"
                          ref="newDonationLink"
                          class="form-control input-transparent pl-3"
                          type="text"
                          required
                          placeholder=""/>
                      </b-input-group>
                      <small v-show="errors.newDonationLink" class="errormsg"> {{ errors.newDonationLink ? errors.newDonationLink : ""}} </small>
                    </b-form-group>
                  </b-col>

                  <b-col cols=3>
                    <b-form-group label="Início" label-for="newStart">
                      <b-input-group>
                        <input id="newStart"
                          v-model="newForm.newStart" 
                          v-bind:class="{ invalid: errors.newStart !== null }"
                          ref="newStart"
                          class="form-control input-transparent pl-3"
                          type="date"
                          required
                          placeholder=""/>
                      </b-input-group>
                      <small v-show="errors.newStart" class="errormsg"> {{ errors.newStart ? errors.newStart : ""}} </small>
                    </b-form-group>
                  </b-col>
                  
                  <b-col cols=3>
                    <b-form-group label="Fim" label-for="newEnd">
                      <b-input-group>
                        <input id="newEnd"
                          v-model="newForm.newEnd" 
                          v-bind:class="{ invalid: errors.newEnd !== null }"
                          ref="newEnd"
                          class="form-control input-transparent pl-3"
                          type="date"
                          required
                          placeholder=""/>
                      </b-input-group>
                      <small v-show="errors.newEnd" class="errormsg"> {{ errors.newEnd ? errors.newEnd : ""}} </small>
                    </b-form-group>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col>
                    <b-button type="submit" variant="dark" class="auth-btn" size="sm">
                      <span class="auth-btn-circle">
                        <i class="la la-caret-right"></i>
                      </span>
                      Criar
                    </b-button>
                  </b-col>             
                 </b-row>

              </form>
            </b-row>
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
  name: 'Events',
  data() {
    return{
      showCreate: false,

      newForm: {
        newName: '',
        newDonationLink: '',
        newStart: '',
        newEnd: '',
      },

      errors: {
        name: null,
        donationLink: null,
        start: null,
        end: null,

        newName: null,
        newDonationLink: null,
        newStart: null,
        newEnd: null,
      },

      table: {

      },
    }
  },
  methods: {
    updateEvent(id, name, donationLink, start, end){
      const wsPayload = {"endpoint":"updateEvent", "id":this.curReq, info:{"id":id, "name":name, "donation_link":donationLink, "start": start, "end": end}};
      this.$store.commit('layout/SOCKET_SEND', wsPayload);
    },
    toggleCreate(){
      this.showCreate = !this.showCreate;
    },
    submit(){
      if(this.newValidation()){
        const wsPayload = {
          "endpoint":"createEvent", 
          "id":this.curReq, 
          info:{
            "name": this.newForm.newName, 
            "donation_link": this.newForm.newDonationLink, 
            "start": this.newForm.newStart, 
            "end": this.newForm.newEnd
            }
          };
        console.log(wsPayload);
        this.$store.commit('layout/SOCKET_SEND', wsPayload);
      }
    },
    newValidation(){
      let validationCheck = true;

      for(let element in this.errors){
        this.errors[element] = null;
      }

      if(!this.newForm.newName || /^\s*$/.test(this.newForm.newName)) {
        this.errors.newName = 'Campo obrigatório';
        validationCheck = false
      }
      if(!this.newForm.newDonationLink || /^\s*$/.test(this.newForm.newDonationLink)) {
        this.errors.newDonationLink = 'Campo obrigatório';
        validationCheck = false
      }
      if(!this.newForm.newStart || /^\s*$/.test(this.newForm.newStart)) {
        this.errors.newStart = 'Campo obrigatório';
        validationCheck = false
      }
      if(!this.newForm.newEnd || /^\s*$/.test(this.newForm.newEnd)) {
        this.errors.newEnd = 'Campo obrigatório';
        validationCheck = false
      }

      return validationCheck;
    },

    alterState(id){
      const wsPayload = {"endpoint":"updateEventState", "id":this.curReq, "info":{ "id": id }};
      this.$store.commit('layout/SOCKET_SEND', wsPayload);
    }
  },
  computed: {
    ...mapState('layout', {
      eventsList: state => state.eventsList,
      curReq: state => state.curReq
    }),
  },
  components: {
    Widget,
  },
  async created(){
    const wsPayload = {"endpoint":"getEvents", "id":this.curReq};
    this.$store.commit('layout/SOCKET_SEND', wsPayload);
  },
};
</script>

<style>
input.invalid{
  border-color: #800000;
  border-width: 3px;
  z-index: 3;
}

.errormsg {
  color: red
}
</style>
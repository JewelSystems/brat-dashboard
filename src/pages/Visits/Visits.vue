<template>
  <div class="visits-page">
    <h1 class="page-title">Dashboard &nbsp;
      <small>
        <p v-if="this.permissions.includes('Admin')">Admin</p>
        <p v-else>Runner</p>
      </small>
    </h1>

    <Schedule v-if="this.permissions.includes('Admin')"/>

    <b-row v-if="this.permissions.includes('Admin')">
      <b-col>
        <Widget
          title="<h5>Evento <span class='fw-semi-bold'>Ativo</span></h5>"
          customHeader collapse
        >
          <div class="table-resposive">
            {{ getActiveEvent() }}
            <table class="table" v-if="activeEvent !== undefined">
              <thead>
                <tr>
                  <th class="hidden-sm-down">#id</th>
                  <th>Nome</th>
                  <th>Link para doação</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{activeEvent.id}}</td>
                  <td>{{activeEvent.name}}</td>
                  <td><a :href=activeEvent.donation_link>{{activeEvent.donation_link}}</a></td>
                  <td>{{formatDate(activeEvent.start)}}</td>
                </tr>
                <!--
                <tr v-for="row in this.eventsList" :key="row.id">
                  <td v-if="row.active === `A`">{{row.id}}</td>
                  <td v-if="row.active === `A`">{{row.name}}</td>
                  <td v-if="row.active === `A`"><a :href=row.donation_link>{{row.donation_link}}</a></td>
                  <td v-if="row.active === `A`">{{formatDate(row.start)}}</td>
                </tr>
                -->
              </tbody>
            </table>
            <div v-else>
              <span>Não existe nenhum evento ativo!</span>
            </div>
          </div>
          <div class="clearfix">
            <div class="float-right">
              <router-link :to="`/app/events`"><b-button variant="dark">Gerenciar eventos</b-button></router-link>
            </div>
          </div>
        </Widget>
      </b-col>
    </b-row>

    <SubmittedRuns v-if="this.permissions.includes('Admin')"/>

    <b-row>
      <b-col>
        <Widget
          title="<h5>Suas <span class='fw-semi-bold'>Runs</span></h5>"
          customHeader collapse
        >
          <div class="table-resposive">
            <table class="table" v-if="this.userRuns.length !== 0">
              <thead>
                <tr>
                  <th>Evento</th>
                  <th>Jogo</th>
                  <th>Categoria</th>
                  <th>Plataforma</th>
                  <th>Turno</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in this.userRuns" :key="row.id">
                  <td>{{ row.event }}</td>
                  <td>{{ row.game }}</td>
                  <td>{{ row.category }}</td>
                  <td>{{ row.platform }}</td>
                  <td>{{ translateInterval(row.time_slot) }}</td>
                  <td>
                    <b-badge v-if="getStatus(row.reviewed, row.approved, row.waiting) === 0" variant='gray'> Não Revisada </b-badge>
                    <b-badge v-if="getStatus(row.reviewed, row.approved, row.waiting) === 1" variant='success'> Aprovada </b-badge>
                    <b-badge v-if="getStatus(row.reviewed, row.approved, row.waiting) === 2" variant='primary'> Aprovada, na fila de espera </b-badge>
                    <b-badge v-if="getStatus(row.reviewed, row.approved, row.waiting) === 3" variant='danger'> Recusada </b-badge>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else>
                <span>Você ainda não possui runs!</span>
            </div>
            <div class="clearfix">
              <div class="float-right">
                <router-link :to="`/app/submitrun`"><b-button variant="dark">Criar nova run</b-button></router-link>
              </div>
            </div>
          </div>
        </Widget>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget';
import Schedule from './components/Schedule';
import SubmittedRuns from './components/SubmittedRuns'
import { mapState } from 'vuex';
const moment = require('moment');
export default {
  name: 'Visits',
  data() {
    return{
      activeEvent: undefined,
    }
  },
  methods: {
    getStatus(reviewed, approved, waiting){
      // 0 = Não revisada
      // 1 = Aprovada
      // 2 = Aprovada, na fila de espera
      // 3 = Recusada
      let resp = 0;
      if(reviewed){
        if(approved){
          resp = 1
          if(waiting){
            resp = 2
          }
        }else{
          resp = 3
        }
      }
      else{
        resp = 0
      }
      return resp
    },
    formatDate(date){
      moment.locale(navigator.language)
      return moment(date, "YYYY-MM-DD").format('DD MMMM YYYY');
    },
    formatSeconds(seconds){
      return moment("2021-01-01").startOf('day').seconds(seconds).format('HH:mm:ss');
    },
    translateInterval(interval){
      //Manhã     = 1000;
      //Tarde     = 0100;
      //Noite     = 0010;
      //Madrugada = 0001;
      if(interval){
        let resp = [];
        if(interval[0] === '1') resp.push("Manhã")
        if(interval[1] === '1') resp.push("Tarde")
        if(interval[2] === '1') resp.push("Noite")
        if(interval[3] === '1') resp.push("Madrugada")
        resp = resp.join(", ")
        return resp;
      }
      return '';
    },
    getActiveEvent(){
      this.activeEvent = this.eventsList.find(element => element.active === "A");
    }
  },
  computed: {
    ...mapState('layout', {
      permissions: state => state.permissions,
      curReq: state => state.curReq,
      id: state => state.id,
      userRuns: state => state.userRuns,
      eventsList: state => state.eventsList,
    }),
  },
  created(){
    let wsPayload = {"endpoint":"getUserRuns", "id":this.curReq, info:{"id": this.id}};
    this.$store.commit('layout/SOCKET_SEND', wsPayload);

    if(this.permissions.includes('Admin')){
      wsPayload = {"endpoint":"getEvents", "id":this.curReq};
      this.$store.commit('layout/SOCKET_SEND', wsPayload);
    }
  },
  components:{
    Widget,
    Schedule,
    SubmittedRuns
  }
};
</script>

<style src="./Visits.scss" lang="scss" />

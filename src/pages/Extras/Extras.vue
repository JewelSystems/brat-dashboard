<template>
  <div>
    <h1 class="page-title">Página de Extras &nbsp;</h1>
    <b-row>
      <b-col>
        <Widget
          title="<h5>Tabela de <span class='fw-semi-bold'>Extras</span></h5>"
          customHeader
        >
          <div class="table-resposive">
            <table class="table" v-if="this.extrasList.length !== 0">
              <thead>
                <tr>
                  <th class="hidden-sm-down">#id</th>
                  <th>Evento</th>
                  <th>Tipo</th>
                  <th>Duração</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in this.extrasList" :key="row.id">
                  <td>{{row.id}}</td>
                  <td>{{row.name}}</td>
                  <td>{{row.type}}</td>
                  <td>{{formatTime(row.time)}}</td>
                </tr>
              </tbody>
            </table>
            <div v-else>
              Não existe nenhum extra cadastrado!
            </div>
          </div>
          <div class="clearfix">
            <div class="float-right">
              <b-button @click="toggleCreate" variant="dark">Criar extra</b-button>
            </div>
          </div>

          <div v-show="showCreate">
            <b-row>
              <h4>Novo extra</h4>
            </b-row>
            <b-row style="padding-left: 12px">
              <form novalidate class="mt" @submit.prevent="submit">
                <b-row>

                  <b-col>
                    <b-form-group label="Tipo do extra" label-for="newType">
                      <b-input-group>
                        <input id="newType"
                          v-model="newForm.newType" 
                          v-bind:class="{ invalid: errors.newType !== null }"
                          ref="newType"
                          class="form-control input-transparent pl-3"
                          type="text"
                          required
                          placeholder=""/>
                      </b-input-group>
                      <small v-show="errors.newType" class="errormsg"> {{ errors.newType ? errors.newType : ""}} </small>
                    </b-form-group>
                  </b-col>

                  <b-col>
                    <b-form-group label="Duração do extra" label-for="newTime">
                      <b-input-group>
                        <input id="newTime"
                          v-model="newForm.newTime" 
                          v-bind:class="{ invalid: errors.newTime !== null }"
                          ref="newTime"
                          class="form-control input-transparent pl-3"
                          type="time"
                          required
                          placeholder="Tempo estimado"
                          step='1'
                          min="00:00:00" max="24:00:00"
                          />
                      </b-input-group>
                      <small v-show="errors.newTime" class="errormsg"> {{ errors.newTime ? errors.newTime : ""}} </small>
                    </b-form-group>
                  </b-col>

                  <b-col style='margin-top: 34px'>
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
  name: 'Extras',
  data() {
    return{
      showCreate: false,

      newForm: {
        newType: '',
        newTime: '',
      },
      errors: {
        newType: null,
        newTime: null,
      }
    }
  },
  methods: {
    formatTime(time){
      let curTime = time;
      const hours = Math.floor(curTime/3600);
      curTime = curTime - hours*3600;
      const minutes = Math.floor(curTime/60);
      curTime = curTime - minutes*60;
      const seconds = curTime;
      let resp = '';
      if(hours){ 
        resp += hours + " hora";
        if(hours > 1){
          resp += "s";
        }
        resp += " ";
      }
      if(minutes){ 
        resp += minutes + " minuto";
        if(minutes > 1){
          resp += "s";
        }
        resp += " ";
      }
      if(seconds){ 
        resp +=  seconds + " segundo";
        if(seconds > 1){
          resp += "s";
        }
        resp += " ";
      }
      //console.log("teste: ", moment.utc(time*1000).format('HH[ horas] mm[ minutos] ss [ segundos]'));
      //console.log('test: ', moment.duration(time, 'seconds').humanize());
      return resp;
    },
    toggleCreate(){
      this.showCreate = !this.showCreate;
    },
    submit(){
      if(this.newValidation()){
        let formatTime = this.newForm.newTime.split(':');
        let duration = 0;
        if(formatTime[0]) duration += Number(formatTime[0]) * 3600;
        if(formatTime[1]) duration += Number(formatTime[1]) * 60;
        if(formatTime[2]) duration += Number(formatTime[2]);

        const wsPayload = {
          "endpoint":"createEventExtra", 
          "id":this.curReq, 
          info:{
            "type": this.newForm.newType, 
            "time": duration, 
            }
          };
        this.$store.commit('layout/SOCKET_SEND', wsPayload);
      }
    },
    newValidation(){
      let validationCheck = true;

      for(let element in this.errors){
        this.errors[element] = null;
      }

      if(!this.newForm.newType || /^\s*$/.test(this.newForm.newType)) {
        this.errors.newType = 'Campo obrigatório';
        validationCheck = false
      }
      if(!this.newForm.newTime || /^\s*$/.test(this.newForm.newTime)) {
        this.errors.newTime = 'Campo obrigatório';
        validationCheck = false
      }

      return validationCheck;
    },
  },
  computed: {
    ...mapState('layout', {
      extrasList: state => state.extrasList,
      curReq: state => state.curReq
    }),
  },
  components: {
    Widget,
  },
  async created(){
    const wsPayload = {"endpoint":"getEventExtras", "id":this.curReq};
    this.$store.commit('layout/SOCKET_SEND', wsPayload);
  },
};
</script>


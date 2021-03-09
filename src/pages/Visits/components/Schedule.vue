<template>
  <div>
  <!-- Function that is triggered to update initial values -->
  {{ onReload() }}
    <b-row v-if="this.permissions.includes('Admin')">
      <b-col>
        <Widget
          :title="eventTitle"
          customHeader collapse
        >
          <!-- Modal Confirmations -->
          <b-modal 
            id='remove-row' 
            title="Remoção de agendamento"
            centered
            ok-variant="dark"
            cancel-variant="dark"
            ok-title="Confirmar"
            cancel-title="Cancelar"
            @ok="confirmRowRemotion">
              <p class="my-4">Tem certeza que deseja removar o agendamento? </p>
          </b-modal>

          <b-modal 
            id='remove-setups' 
            title="Remoção de tempos de setup"
            centered
            ok-variant="dark"
            cancel-variant="dark"
            ok-title="Confirmar"
            cancel-title="Cancelar"
            @ok="confirmSetupRemotion">
              <p class="my-4">Tem certeza que deseja removar os tempos de setup? </p>
          </b-modal>

          <b-modal 
            id='add-setup' 
            title="Adicionar tempo de setup"
            centered
            ok-variant="dark"
            cancel-variant="dark"
            ok-title="Confirmar"
            cancel-title="Cancelar"
            @ok="confirmAddSetup">
            <p class="my-4">Escolha a duração do tempo de setup que será adicionado no agendamento.</p>
            <b-form-group label="" label-for="estimatedTime">
              <b-input-group>
                <input id="setupTime"
                      v-model="setupTime" 
                      v-bind:class="{ invalid: toSeconds(setupTime) < 1 }"
                      ref="setupTime"
                      class="form-control input-transparent pl-3"
                      type="time"
                      required
                      step='1'
                      min="00:00:00" max="24:00:00"
                      />
              </b-input-group>
              <small v-show="toSeconds(setupTime) < 1" class="errormsg"> Por favor, insira um valor válido. </small>
            </b-form-group>
          </b-modal>

          <b-modal 
            id='add-setups' 
            title="Adicionar tempos de setup"
            centered
            ok-variant="dark"
            cancel-variant="dark"
            ok-title="Confirmar"
            cancel-title="Cancelar"
            @ok="confirmAddSetups">
            <p class="my-4">Escolha a duração dos tempos de setup que serão adicionados.</p>
            <b-form-group label="" label-for="estimatedTime">
              <b-input-group>
                <input id="setupTime"
                      v-model="setupTime" 
                      v-bind:class="{ invalid: toSeconds(setupTime) < 1 }"
                      ref="setupTime"
                      class="form-control input-transparent pl-3"
                      type="time"
                      required
                      step='1'
                      min="00:00:00" max="24:00:00"
                      />
              </b-input-group>
              <small v-show="toSeconds(setupTime) < 1" class="errormsg"> Por favor, insira um valor válido. </small>
            </b-form-group>
            <p class="my-4">Ao confirmar, um tempo de setup será adicionado antes de todos os agendamentos.</p>
          </b-modal>

          <b-modal 
            id='add-schedule-row' 
            title="Adicionar novo agendamento"
            centered
            ok-variant="dark"
            cancel-variant="dark"
            ok-title="Confirmar"
            cancel-title="Cancelar"
            @ok="addNewRow">
              <!-- TODO Checar se já não existem em schedule(pelo id da schedule.row) -->
              <b-form-group label="Escolha que tipo de agentamento deseja inserir: " v-slot="{ ariaDescribedby }" label-for="type">
                <b-form-radio-group
                  id="type"
                  v-model="scheduleRowType" 
                  :options="scheduleRowOption"
                  :aria-describedby="ariaDescribedby"
                ></b-form-radio-group>
              </b-form-group>

              <div v-if="scheduleRowType === 'run'"> 
                <b-form-group label="Runs:">
                  <b-form-select id="runs-dropdown" v-model="selectedRun" class="md-2" variant="dark">
                    <b-form-select-option :value="null">Selecione uma run para adicionar ao cronograma.</b-form-select-option>
                    <b-form-select-option 
                    v-for="run in submittedRuns.filter(element => eventRunsList.filter(el2 => el2.submit_run_id === element.id && schedule.filter(el3 => el3.event_run_id === el2.id).length === 0).length !== 0)" 
                    :key="run.id" 
                    :value="run.id">
                      {{run.id}}
                    </b-form-select-option>
                  </b-form-select>
                </b-form-group>
              </div>

              <div v-if="scheduleRowType === 'extra'"> 
                <!-- {{extrasList}} -->
                <b-form-group label="Extras:">
                  <b-form-select id="extras-dropdown" v-model="selectedExtra" class="md-2" variant="dark">
                    <b-form-select-option :value="null">Selecione um extra para adicionar ao cronograma.</b-form-select-option>
                    <b-form-select-option 
                    v-for="extra in extrasList.filter(element => schedule.filter(schElement => schElement.event_extra_id === element.id).length === 0)" 
                    :key="extra.id" 
                    :value="extra.id">
                      {{ extra.id }} - {{ extra.type }} {{ extra.name }}
                    </b-form-select-option>
                  </b-form-select>
                </b-form-group>
              </div>

          </b-modal>

        <!-- Schedule Creator -->
          <div class="table-resposive">
            <div class="clearfix">
              <div class="float-right">
                <b-button @click="toggleDrag" variant="dark" v-if="dragEnabled">Desativar edição</b-button>
                <b-button @click="toggleDrag" variant="dark" v-else>Ativar edição</b-button>
              </div>
            </div>
            <table class="table" v-if="schedule.length !== 0">
              <thead>
                <tr>
                  <th class="hidden-sm-down"></th>
                  <th class="hidden-sm-down">#id</th>
                  <th>Horário</th>
                  <th>Jogo</th>
                  <th>Estimativa</th>
                  <th>Tempo Extra</th>
                  <th>Categoria</th>
                  <th>Intervalo</th>
                  <th>Plataforma</th>
                  <th>Runner</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <draggable 
                :disabled="!dragEnabled"
                v-model="schedule" 
                tag="tbody"
                ghost-class="ghost"
                @change="updateSchedule"
                animation='100'
              >
                <tr v-for="(row, idx) in schedule" :key="idx" class="dnd-item">
                  <td  v-if="dragEnabled" class="dnd-handle align-middle"> <i class="fa fa-align-justify handle"></i> </td>
                  <td v-else></td>
                  <td class="align-middle"> {{ row.id }}</td>
                  <td class="align-middle"> {{ formatHorary(row.event_date, row.duration, row.extra_time) }}</td>
                  <td class="align-middle"> {{ row.order }} - {{ row.game }} </td>
                  <td class="align-middle" v-if="row.type !== 'setup' || !dragEnabled"> {{ formatInterval(row.duration) }}</td>
                  <td class="align-middle" v-else>
                    <input
                      :value=formatInterval(row.duration)
                      @input="row.duration = toSeconds($event.target.value)"
                      ref="duration"
                      class="form-control input-transparent pl-3"
                      type="time"
                      step='1'
                    />
                  </td>
                  <td class="align-middle"> {{ formatInterval(row.extra_time) }}</td>
                  <td class="align-middle"> {{ (row.category ? row.category:"") }}</td>
                  <td class="align-middle"> {{ (row.interval ? translateInterval(row.interval):"") }} </td>
                  <td class="align-middle"> {{ (row.platform ? row.platform:"") }}</td>

                  <td class="align-middle" v-if="row.stream_link"><a :href=row.stream_link> {{ row.runner }} </a></td>
                  <td class="align-middle" v-else> {{ row.runner }} </td>

                  <td class="align-middle" v-show="dragEnabled" v-if="row.type !== 'setup'"> <b-button @click="addSetup(idx)" variant="dark">Adicionar setup</b-button> </td>
                  <td v-else> </td>

                  <td v-if="row.type === 'run'">
                    <b-button @click="toggleDonation(row.id)" variant="dark"> Doar </b-button>
                  </td>
                  <td v-else></td>


                  <td class="align-middle" v-show="dragEnabled"><i class="fa fa-times close" @click="removeAt(row.order-1)"></i> </td>
                </tr>

                <Donation @closeDonation="toggleDonation" v-if="showDonation" :runScheduleId=donationRun />

              </draggable>
            </table>
            <div v-else>A agenda está vazia!</div>
            <div class="clearfix">
              <div class="float-right">
                <b-button v-show="dragEnabled" @click="newScheduleRow" variant="dark" style="margin-right: 10px">Adicionar agendamento no cronograma</b-button>
                <b-button v-show="dragEnabled" @click="removeSetups" variant="dark" style="margin-right: 10px">Remover tempos de setup</b-button>
                <b-button v-show="dragEnabled" @click="addSetups" variant="dark">Adicionar tempos de setup</b-button>
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
import draggable from 'vuedraggable';
import Donation from './Donation';
import { mapState } from 'vuex';
const moment = require('moment');
let curTime = 0;
export default {
  name: 'Schedule',
  data() {
    return{
      dragging: false,
      eventTitle: '',
      removeIdx: -1,
      addIdx: -1,

      setupTime: '00:10:00',
      dragEnabled: true,

      //Donation tab
      showDonation: false,
      donationRun: null,

      //Insert a new row on the schedule
      scheduleRowType: 'run',
      scheduleRowOption:[
        { text: 'Run', value: 'run' },
        { text: 'Extra', value: 'extra' },
      ],

      //Add row
      selectedExtra: null,
      selectedRun: null,
    }
  },
  created(){
    let wsPayload = {"endpoint":"getEventSchedule", "id":this.curReq};
    this.$store.commit('layout/SOCKET_SEND', wsPayload);
    
    wsPayload = {"endpoint":"getEventExtras", "id":this.curReq};
    this.$store.commit('layout/SOCKET_SEND', wsPayload);

    wsPayload = {"endpoint":"getEventRuns", "id":this.curReq};
    this.$store.commit('layout/SOCKET_SEND', wsPayload);
  },
  methods:{
    //Create a row for an event run or an event extra
    newScheduleRow(){
      this.$bvModal.show('add-schedule-row');
    },
    addNewRow(){
      let wsPayload = null;
      if(this.scheduleRowType === 'run'){
        wsPayload = {"endpoint":"createEventSchedule", "id":this.curReq, info:{"order": this.schedule.length+1, "type": 'run', "event_run_id": this.selectedRun, "event_extra_id": null, "extra_time": 0, shouldGetRun: true}};
        this.selectedRun = null;
      }
      if(this.scheduleRowType === 'extra'){
        wsPayload = {"endpoint":"createEventSchedule", "id":this.curReq, info:{"order": this.schedule.length+1, "type": 'extra', "event_run_id": null, "event_extra_id": this.selectedExtra, "extra_time": 0}};
        this.selectedExtra = null;
      }
      this.$store.commit('layout/SOCKET_SEND', wsPayload);
    },
    //String Formatting
    formatInterval(time){
      if(!time) return ""
      let curTime = time;
      const hours = Math.floor(curTime/3600);
      curTime = curTime - hours*3600;
      const minutes = Math.floor(curTime/60);
      curTime = curTime - minutes*60;
      const seconds = curTime;
      let resp = '';
      if(hours){ 
        if(Math.floor(Math.log10(hours)) === 0){ resp +=  "0" + hours; }
        else { resp += hours }
      }else{
        resp += "00"
      }
      if(minutes){
        if(Math.floor(Math.log10(minutes)) === 0){ resp +=  ":0" + minutes; }
        else { resp +=  ":" + minutes }
      }else{
        resp += ":00"
      }
      if(seconds){
        if(Math.floor(Math.log10(seconds)) === 0){ resp +=  ":0" + seconds; }
        else { resp +=  ":" + seconds }
      }else{
        resp += ":00"
      }
      return resp;
    },
    formatHorary(date, duration, extra){
      const resp = moment(date).valueOf() + curTime;
      curTime += duration*1000;
      if(extra){ curTime += extra*1000 }
      return moment(resp).format('HH:mm:ss [de] DD/MM/YYYY');
    },
    toSeconds(time){
      let resp = time.split(':');
      resp = (resp[0] ? Number(resp[0])*3600 : 0) + (resp[1] ? Number(resp[1])*60 : 0) + (resp[2] ? Number(resp[2]) : 0);
      //TODO
      return resp;
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
    //Schedule Create
    async createSetup(idx){
      let setups = []
      if(idx !== -1){
        //One setup
        const setup = {
          "type": "setup",
          "event_id": this.schedule[idx].event_id,
          "event_name": this.schedule[idx].event_name,
          "event_date": this.schedule[idx].event_date,
          "game": "Setup",
          "duration": this.toSeconds(this.setupTime),
          "order": idx+1,
        };
        await this.schedule.splice(idx, 0, setup);
        for(let val in this.schedule){
          this.schedule[val].order = Number(val) + 1;
        }
        setups.push(setup);
      }else{
        //Multiple setups
        for(let idx = 0; idx < this.schedule.length; idx++){
          if(!(this.schedule[idx-1] && this.schedule[idx-1].type === 'setup' || this.schedule[idx].type === 'setup')){
            console.log('a');
            const setup = {
              "type": "setup",
              "event_id": this.schedule[idx].event_id,
              "event_name": this.schedule[idx].event_name,
              "event_date": this.schedule[idx].event_date,
              "game": "Setup",
              "duration": this.toSeconds(this.setupTime),
              "order": idx+1,
            };
            await this.schedule.splice(idx, 0, setup);
            for(let val in this.schedule){
              this.schedule[val].order = Number(val) + 1;
            }
            setups.push(setup);
          }
        }
      }
      await this.createSchedule(setups);
    },
    addSetup(idx){
      this.addIdx = idx;
      if(!(this.schedule[idx-1] && this.schedule[idx-1].type === 'setup') ){
        this.$bvModal.show('add-setup');
      }
    },
    confirmAddSetup(){
      if(this.toSeconds(this.setupTime) > 0){
        this.createSetup(this.addIdx);
      }
    },
    addSetups(){
      this.$bvModal.show('add-setups');
    },
    confirmAddSetups(){
      if(this.toSeconds(this.setupTime) > 0){
        this.createSetup(-1);
      }
    },
    //Schedule Remove
    removeSetups(){
      this.$bvModal.show('remove-setups');
    },
    confirmSetupRemotion(){
      for(let idx = 0; idx < this.schedule.length; idx++){
        if(this.schedule[idx].type === 'setup'){
          console.log('removido em ', idx);
          this.deleteSchedule(idx);
          this.schedule.splice(idx, 1);
          idx--;
        }
      }
    },
    removeAt(idx) {
      this.$bvModal.show('remove-row');
      this.removeIdx = idx;
    },
    confirmRowRemotion(){
      this.deleteSchedule(this.removeIdx);
      this.schedule.splice(this.removeIdx, 1);
    },
    //Websocket Request Functions
    updateSchedule(){
      let data = [];
      for(let event in this.schedule){
        data.push({ "id": this.schedule[event].id, "order": this.schedule[event].order });
      }
      const wsPayload = {"endpoint":"updateEventSchedule", "id":this.curReq, "info":{ "data": JSON.stringify(data) }};
      this.$store.commit('layout/SOCKET_SEND', wsPayload);
    },
    createSchedule(setups){
      let data = [];
      for(let event in this.schedule){
        data.push({ "id": this.schedule[event].id, "order": this.schedule[event].order });
      }
      const wsPayload = {"endpoint":"createSetupEventSchedule", "id":this.curReq, "info":{ 
        "data": JSON.stringify(data),
        "setups": setups,
        /*
        "duration": setup.duration, 
        "event_id": setup.event_id,
        "game": setup.game,
        "order": setup.order,
        "type": setup.type, 
        */
        }};
      this.$store.commit('layout/SOCKET_SEND', wsPayload);
    },
    deleteSchedule(idx){
      const wsPayload = {"endpoint":"deleteEventSchedule", "id":this.curReq, "info":{ "id": this.schedule[idx].id }};
      this.$store.commit('layout/SOCKET_SEND', wsPayload);
    },
    //Triggered on Reload
    onReload(){
      curTime = 0
      if(this.schedule[0] !== undefined) {
        this.eventTitle = "<h5>Agenda <span class='fw-semi-bold'>do Evento " + this.schedule[0].event_name + "</span></h5>";
      }else{
        this.eventTitle = "<h5>Agenda <span class='fw-semi-bold'>do Evento</span></h5>";
      }
      console.log('reloading page');
    },
    //Toggle Drag and Drop
    toggleDrag(){
      this.dragEnabled = !this.dragEnabled;
    },
    //Donation
    toggleDonation(id){
      this.donationRun = id
      this.showDonation = !this.showDonation;
    }
  },
  computed: {
    ...mapState('layout', {
      permissions: state => state.permissions,
      curReq: state => state.curReq,
      submittedRuns: state => state.submittedRuns,
      extrasList: state => state.extrasList,
      eventRunsList: state => state.eventRunsList,
    }),
    schedule: {
      get() {
          return this.$store.state.layout.schedule;
      },
      set(value) {
          this.$store.commit('layout/updateScheduleList', value)
      }
    }
  },
  components:{
    Widget,
    draggable,
    Donation
  },
};
</script>

<style>
.ghost {
  opacity: 1;
  background: #15172e;
}

.dnd-handle {
  cursor: move;
}

input.invalid{
  border-color: #800000;
  border-width: 3px;
  z-index: 3;
}

.errormsg {
  color: red
}
</style>
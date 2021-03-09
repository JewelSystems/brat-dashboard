<template>
  <div v-if="this.permissions.includes('Admin')">
    <!-- Review Modal -->
    <b-modal 
      id='review-run' 
      :title="`Revisar run de #ID ` + curRunId"
      centered
      ok-variant="dark"
      cancel-variant="dark"
      ok-title="Cancelar"
      ok-only>
      <hr/>
        <div v-if="curSubmitRun">
          <b-row>
            <b-col>Runner: {{ curSubmitRun.runner }} </b-col>
          </b-row>
          <b-row>
            <b-col>Jogo: {{ curSubmitRun.game_name }} </b-col>
          </b-row>
          <b-row>
            <b-col>
              <span>Status Atual: </span>
              <b-badge v-if="getStatus(curSubmitRun.reviewed, curSubmitRun.approved, curSubmitRun.waiting) === 0" variant='gray'> Não Revisada </b-badge>
              <b-badge v-if="getStatus(curSubmitRun.reviewed, curSubmitRun.approved, curSubmitRun.waiting) === 1" variant='success'> Aprovada </b-badge>
              <b-badge v-if="getStatus(curSubmitRun.reviewed, curSubmitRun.approved, curSubmitRun.waiting) === 2" variant='primary'> Aprovada, na fila de espera </b-badge>
              <b-badge v-if="getStatus(curSubmitRun.reviewed, curSubmitRun.approved, curSubmitRun.waiting) === 3" variant='danger'> Recusada </b-badge>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-button @click="approve()" style="margin-right: 10px" variant="success">Aprovar</b-button>
              <b-button @click="refuse()" style="margin-right: 10px" variant="danger">Recusar</b-button>
              <b-button @click="approveWaiting()" variant="primary">Aprovar e colocar na fila</b-button>
            </b-col>
          </b-row>
          <span style="color: red;"> {{ evaluationError }} </span>
        </div>
        <hr/>
    </b-modal>

    <!-- Submit Runs Table Constructor -->
    <b-row>
      <b-col>
        <Widget
          title="<h5>Runs <span class='fw-semi-bold'>do Evento</span></h5>"
          customHeader collapse
        >
          <div class="table-resposive">
            <table class="table" v-if="this.submittedRuns.length !== 0">
              <thead>
                <tr>
                  <th></th>
                  <th>#ID</th>
                  <th>Evento</th>
                  <th>Jogo</th>
                  <th>Categoria</th>
                  <th>Plataforma</th>
                  <th>Turno</th>
                  <th>Runner</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody v-for="(row, idx) in submittedRuns" :key="row.id">
                  <tr>
                    <td v-if="row.incentives.length === 0"></td>
                    <td v-else>
                      <b-button v-show="!toggle(idx)" @click="toggleIncentives(idx)" variant="dark"><i class="las la-angle-right"></i></b-button>
                      <b-button v-show="toggle(idx)" @click="toggleIncentives(idx)" variant="dark"><i class="las la-angle-down"></i></b-button>
                    </td>

                    <td class="align-middle">{{ row.id }}</td>
                    <td class="align-middle">{{ row.event_name }}</td>
                    <td class="align-middle">{{ row.game_name }}</td>
                    <td class="align-middle">{{ row.category }}</td>
                    <td class="align-middle">{{ row.platform }}</td>
                    <td class="align-middle">{{ translateInterval(row.time_slot) }}</td>
                    <td class="align-middle">{{ row.runner }}</td>
                    <td class="align-middle">
                      <b-badge v-if="getStatus(row.reviewed, row.approved, row.waiting) === 0" variant='gray'> Não Revisada </b-badge>
                      <b-badge v-if="getStatus(row.reviewed, row.approved, row.waiting) === 1" variant='success'> Aprovada </b-badge>
                      <b-badge v-if="getStatus(row.reviewed, row.approved, row.waiting) === 2" variant='primary'> Aprovada, na fila de espera </b-badge>
                      <b-badge v-if="getStatus(row.reviewed, row.approved, row.waiting) === 3" variant='danger'> Recusada </b-badge>
                    </td>
                    <td>
                      <b-button @click="reviewRun(row.id)" variant="dark">Revisar</b-button>
                    </td>
                  </tr>

                  <!-- Run Incentive Sub-Table Constructor -->
                  <tr v-show="toggle(idx)"
                    style="background-color: #303462; border-left: 1px solid black; border-right: 1px solid black;">
                    <td colspan="10" class="align-middle">
                      <div class="table-resposive">
                        <table class="table table-sm table-striped">
                          <thead>
                            <tr>
                              <th>#ID</th>
                              <th>Nome</th>
                              <th>Tipo</th>
                              <th>Opções</th>
                              <th>Comentário</th>
                              <th>Editar Incentivo</th>
                              <th>Meta</th>
                              <th>Validação</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="incentive in row.incentives" :key="incentive.id"
                              v-show="toggle(idx)">
                              <td scope="col" class="align-middle">{{ incentive.id }} </td>
                              <td class="align-middle">
                                <input
                                  v-model="incentive.name"
                                  ref="name"
                                  class="form-control input-transparent pl-3"
                                  type="text"
                                />
                              </td>

                              <td class="align-middle" v-if="incentive.type === 'public'">Escolha do público</td>
                              <td class="align-middle" v-if="incentive.type === 'private'">Escolha do runner</td>
                              <td class="align-middle" v-if="incentive.type === 'none'">Sem múltipla escolha</td>

                              <td
                                class="align-middle" 
                                v-if="incentive.type === 'private'">
                                <div v-for="(option, optIdx) in incentive.BidwarOptions" :key="optIdx">
                                  {{ 'Opção ' + (optIdx+1) }}
                                  <input
                                    v-model="option.option"
                                    ref="option"
                                    class="form-control input-transparent pl-3"
                                    type="text"
                                  />
                                </div>
                              </td>
                              <td v-else></td>

                              <td class="align-middle" style="max-width:400px; word-wrap:break-word;">
                                <textarea
                                  style="overflow: hidden; resize: none"
                                  minlength="100"
                                  maxlength="300"
                                  rows="7"
                                  v-model = incentive.comment
                                  ref="comment"
                                  class="form-control input-transparent pl-3"
                                />
                              </td>

                              <td>
                                <b-button
                                 @mouseenter="toggleEditHover" 
                                 @mouseout="toggleEditHover" 
                                 @click="editIncentive(row.id, incentive.id)" 
                                 variant="dark"
                                 >
                                  Editar
                                 </b-button>
                              </td>


                              <td class="align-middle" v-if="incentive.type === 'none'">
                                <input
                                  v-model="row.goals[incentive.id]"
                                  :class="{invalid: !row.goals[incentive.id] && row.approved_incentives[incentive.id]}"
                                  ref="goal"
                                  class="form-control input-transparent pl-3"
                                  type="number"
                                  style="width:100%; display:block; max-width:300px"
                                />
                              </td>
                              <td v-else></td>
                              
                              <td class="align-middle">
                                <b-form-group v-slot="{ ariaDescribedby }">
                                  <b-form-radio-group
                                    v-model="row.approved_incentives[incentive.id]" 
                                    :options="evaluateOptions"
                                    :aria-describedby="ariaDescribedby"
                                  ></b-form-radio-group>
                                </b-form-group>
                              </td>

                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
              </tbody>
            </table>

            <div v-else>
                <span>O evento ainda não possui runs!</span>
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
const _ = require('lodash');
export default {
  name: 'Visits',
  data() {
    return{
      curRunId: null,
      curSubmitRun: null,

      showIncentives: true,
      toggleIncentive: {},

      evaluationError: '',
      evaluateOptions: [
        { text: 'Aceitar', value: true },
        { text: 'Recusar', value: false },
      ],
    }
  },
  methods: {
    //Row Fomartting Functions
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

    //Review Modal and Requests
    reviewRun(id){
      this.evaluationError = '';
      this.curRunId = id;
      this.curSubmitRun = this.submittedRuns.find(element => element.id === this.curRunId);
      this.$bvModal.show('review-run');
    },
    approve(){
      //TODO validate inputs
      const runsArr = this.submittedRuns.filter(element => element.id === this.curRunId);
      let wsPayload = null;
      //Verify if the run exists and only one was found
      if(runsArr.length === 1){
        const run = runsArr[0];
        if(!run.reviewed){
          for(let incentive in run.incentives){
            if(run.approved_incentives[run.incentives[incentive].id] === undefined) return this.evaluationError = "Por favor, avalie os incentivos da run.";
          }
        }


        if(run.reviewed === true && run.approved === true && run.waiting === false) return this.evaluationError = "A run já foi aprovada.";

        for(let incentive in run.incentives){
          if(run.incentives[incentive].type === 'none' &&
           run.approved_incentives[run.incentives[incentive].id] === true
            && isNaN(run.goals[run.incentives[incentive].id])) return this.evaluationError = "Por favor, preecha todas as metas.";
        }



        //Generate the websocket payload based on the incentives.
        if(run.incentives.length > 0){
          let curIncentives = [];
          for(let incentiveIdx in run.incentives){
            let incentive = run.incentives[incentiveIdx];
            if(run.approved_incentives[incentive.id]){
              if(incentive.type === "none"){
                curIncentives.push({
                  "id": incentive.id,
                  "run_id": incentive.run_id,
                  "type": incentive.type,
                  "goal": run.goals[incentive.id],
                });
              }else{
                let bidwarOption = []
                for(let option in incentive.BidwarOptions){
                  bidwarOption.push({
                    "id": incentive.BidwarOptions[option].id,
                  })
                }

                curIncentives.push({
                  "id": incentive.id,
                  "run_id": incentive.run_id,
                  "type": incentive.type,
                  "goal": 0,
                  "options": bidwarOption,
                });
              }
            }
          }

          wsPayload = {"endpoint":"updateSubmitRunNRunIncentives" , "id": this.curReq, "info":{
            "id": this.curRunId, "reviewed": true, "approved": true, "waiting": false,
            "incentives": curIncentives,
          }};
        }else{
          wsPayload = {"endpoint":"updateSubmitRun", "id":this.curReq, "info":{"id": this.curRunId, "reviewed": true, "approved": true, "waiting": false}};
        }
      }

      this.$store.commit('layout/SOCKET_SEND', wsPayload);
      this.$bvModal.hide('review-run');
    },
    refuse(){
      const runsArr = this.submittedRuns.filter(element => element.id === this.curRunId);
      let wsPayload = null;
      //Verify if the run exists and only one was found
      if(runsArr.length === 1){
        const run = runsArr[0];
        if(run.reviewed === true && run.approved === false && run.waiting === false) return this.evaluationError = "A run já foi recusada.";

        
        if(run.incentives.length > 0){
          wsPayload = {"endpoint":"refuseSubmitRunNRemoveIncentives", "id":this.curReq, "info":{"id": this.curRunId, "reviewed": true, "approved": false, "waiting": false}};
        }else{
          wsPayload = {"endpoint":"updateSubmitRun", "id":this.curReq, "info":{"id": this.curRunId, "reviewed": true, "approved": false, "waiting": false}};
        }
      }

      this.$store.commit('layout/SOCKET_SEND', wsPayload);
      this.$bvModal.hide('review-run');
    },
    approveWaiting(){
      const runsArr = this.submittedRuns.filter(element => element.id === this.curRunId);
      let wsPayload = null;
      //Verify if the run exists and only one was found
      if(runsArr.length === 1){
        const run = runsArr[0];
        if(!run.reviewed){
          for(let incentive in run.incentives){
            if(run.approved_incentives[run.incentives[incentive].id] === undefined) return this.evaluationError = "Por favor, avalie os incentivos da run.";
          }
        }
        if(run.reviewed === true && run.approved === true && run.waiting === true) return this.evaluationError = "A run já está na fila.";

        for(let incentive in run.incentives){
          if(run.incentives[incentive].type === 'none' &&
           run.approved_incentives[run.incentives[incentive].id] === true
            && isNaN(run.goals[run.incentives[incentive].id])) return this.evaluationError = "Por favor, preecha todas as metas.";
        }

        //Generate the websocket payload based on the incentives.
        if(run.incentives.length > 0){
          let curIncentives = [];
          for(let incentiveIdx in run.incentives){
            let incentive = run.incentives[incentiveIdx];
            if(run.approved_incentives[incentive.id]){
              if(incentive.type === "none"){
                curIncentives.push({
                  "id": incentive.id,
                  "run_id": incentive.run_id,
                  "type": incentive.type,
                  "goal": run.goals[incentive.id],
                });
              }else{
                let bidwarOption = []
                for(let option in incentive.BidwarOptions){
                  bidwarOption.push({
                    "id": incentive.BidwarOptions[option].id,
                  })
                }

                curIncentives.push({
                  "id": incentive.id,
                  "run_id": incentive.run_id,
                  "type": incentive.type,
                  "goal": 0,
                  "options": bidwarOption,
                });
              }
            }
          }

          wsPayload = {"endpoint":"updateSubmitRunNRunIncentives" , "id": this.curReq, "info":{
            "id": this.curRunId, "reviewed": true, "approved": true, "waiting": true,
            "incentives": curIncentives,
          }};
        }else{
          wsPayload = {"endpoint":"updateSubmitRun", "id":this.curReq, "info":{"id": this.curRunId, "reviewed": true, "approved": true, "waiting": true}};
        }
      }

      this.$store.commit('layout/SOCKET_SEND', wsPayload);
      this.$bvModal.hide('review-run');
    },

    //Incentives Constrollers
    toggleIncentives(idx){
      let value;
      if(this.toggleIncentive === undefined){
        value = false;
      }else{
        value = !this.toggleIncentive[idx]
      }
      this.$set(this.toggleIncentive, idx, value);
    },
    toggle(idx){
      if(this.toggleIncentive[idx] === undefined) return false;
      return this.toggleIncentive[idx];
    },
    editIncentive(runId, incentiveId){
      const run = this.submittedRuns.find(element => element.id === runId)
      const incentive = run.incentives.find(element => element.id === incentiveId);
      const wsPayload = {
        "endpoint":"updateIncentive", 
        "id":this.curReq, 
        "info":{ 
          "id": incentive.id, 
          "name": incentive.name, 
          "comment": incentive.comment, 
          "goal": run.goals[incentive.id], 
          "bidwar_options": incentive.BidwarOptions 
        }
      };
      this.$store.commit('layout/SOCKET_SEND', wsPayload);
    },
    toggleEditHover(){
      //console.log('foi');
      return;
    },

    //Debounce Test
    updateIncentive: _.debounce(function (e, incentive) {
      console.log(e.target.value);
      console.log(incentive);
      //this.filterKey = e.target.value;
    }, 500)
  }, 
  computed: {
    ...mapState('layout', {
      permissions: state => state.permissions,
      curReq: state => state.curReq,
      id: state => state.id,
      submittedRuns: state => state.submittedRuns,
    }),
  },
  created(){
    let wsPayload = {"endpoint":"getSubmitRuns", "id":this.curReq};
    this.$store.commit('layout/SOCKET_SEND', wsPayload);
  },
  components:{
    Widget
  }
}
</script>


<style scoped>
/* Remove textarea scroller from Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Remove textarea scroller from Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

input.invalid{
  border-color: #800000;
  border-width: 3px;
  z-index: 3;
}
</style>
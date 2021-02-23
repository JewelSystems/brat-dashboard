<template>
  <div>
    <h1 class="page-title">Envie suas runs! &nbsp;
    </h1>
    <b-row>
      <b-col>
        <Widget
          title="<h5>Crie <span class='fw-semi-bold'>uma run</span></h5>"
          customHeader
        >
          <form novalidate class="mt" @submit.prevent="submit">
            <div id="error-block" v-show="errorMessage"></div>
            <!-- Autocomplete Input -->
            <b-form-row>
              <b-col cols="6">
                <b-form-group label="Nome do jogo" label-for="gameName">
                  <div class="autocomplete" >
                    <b-input-group>
                    <input id="gameName"
                        autocomplete="off"
                        type="text"
                        ref="gameName"
                        v-model="form.gameName"
                        v-bind:class="{ invalid: errors.gameName !== null }"
                        @input="onChange"
                        @keydown.down="onArrowDown"
                        @keydown.up="onArrowUp"
                        @keydown.enter="onEnter"
                        class="form-control input-transparent pl-3"/>
                    </b-input-group>
                    <ul class="autocomplete-results" v-show="isOpen">
                      <li
                        class="autocomplete-result" 
                        v-for="(result, i) in results" 
                        :key="i" 
                        @click="setResult(result)"
                        :class="{ 'is-active': i === arrowCounter }">
                        {{ result }}
                      </li>
                    </ul>
                  </div>
                  <small v-show="errors.gameName" class="errormsg"> {{ errors.gameName ? errors.gameName.split(":")[1] : "" }} <br></small>
                </b-form-group>
              </b-col>

              <b-col cols="6">
                <b-form-group label="Ano de Lançamento" label-for="gameYear">
                  <b-input-group>
                    <input id="gameYear"
                          v-model="form.gameYear" 
                          v-bind:class="{ invalid: errors.gameYear !== null }"
                          ref="gameYear"
                          class="form-control input-transparent pl-3"
                          type="text"
                          required
                          placeholder=""/>
                    </b-input-group>
                  <small v-show="errors.gameYear" class="errormsg"> {{ errors.gameYear ? errors.gameYear.split(":")[1] : "" }} <br></small>
                  <small>Informar o ano de lançamento do jogo.</small>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row>
              <b-col cols="6">
                <b-form-group label="Categoria" label-for="category">
                  <b-input-group>
                    <input id="category"
                          v-model="form.category" 
                          v-bind:class="{ invalid: errors.category !== null }"
                          ref="category"
                          class="form-control input-transparent pl-3"
                          type="text"
                          required
                          placeholder=""/>
                  </b-input-group>
                  <small v-show="errors.category" class="errormsg"> {{ errors.category ? errors.category.split(":")[1] : "" }} <br></small>
                  <small>Indique a categoria que você pode fazer (ex: 100%, Any%).</small>
                </b-form-group>
              </b-col>
              <b-col cols="6">
                <b-form-group label="Tempo Estimado" label-for="estimatedTime">
                  <b-input-group>
                    <input id="estimatedTime"
                          v-model="form.estimatedTime" 
                          v-bind:class="{ invalid: errors.estimatedTime !== null }"
                          ref="estimatedTime"
                          class="form-control input-transparent pl-3"
                          type="time"
                          required
                          placeholder="Tempo estimado"
                          step='1'
                          min="00:00:00" max="24:00:00"
                          />
                  </b-input-group>
                  <small v-show="errors.estimatedTime" class="errormsg"> {{ errors.estimatedTime ? errors.estimatedTime.split(":")[1] : "" }} <br></small>
                  <small>
                    Coloque o tempo limite que será necessário para completar a categoria (hh:mm:ss). 
                    Lembre que Personal Best é diferente de Tempo Estimado. 
                    Leve em consideração no tempo estratégias seguras e tempo necessário para backups. 
                    É muito importante conseguir terminar a run no evento.
                  </small>
                </b-form-group>
              </b-col>
            </b-form-row>

            <b-form-row>
              <b-col cols="6">
                <b-form-group label="Intervalo" v-slot="{ ariaDescribedby }">
                  <b-form-checkbox-group
                    id="checkbox-group"
                    v-model="timeSlots"
                    :options="timeSlotOptions"
                    :aria-describedby="ariaDescribedby"
                  >
                  </b-form-checkbox-group>
                  <small>Informar sua disponibilidade de horário.</small>
                </b-form-group>
              </b-col>

              <b-col cols="6">
                <b-form-group label="Plataforma" label-for="platform">
                  <b-input-group>
                    <input id="platform"
                          v-model="form.platform" 
                          v-bind:class="{ invalid: errors.platform !== null }"
                          ref="platform"
                          class="form-control input-transparent pl-3"
                          type="text"
                          required
                          placeholder=""/>
                  </b-input-group>
                <small v-show="errors.platform" class="errormsg"> {{ errors.platform ? errors.platform.split(":")[1] : "" }} <br></small>
                <small>Informar a plataforma que você usará para jogar o jogo(como PS4, PC, Switch).</small>
                </b-form-group>
              </b-col>
            </b-form-row>

            <!-- Incentives -->
            <b-form-row>
              <b-button variant="dark" class="auth-btn" size="sm" @click="showIncentives">
                <span class="auth-btn-circle">
                  <i v-if="toggleIncentives" class="la la-caret-down"></i>
                  <i v-else class="la la-caret-right"></i>
                </span>
                Adicionar incentivos
              </b-button>
            </b-form-row>

            <div id='incentives' v-show="toggleIncentives" style="margin-top: 10px"> 
             
              <b-form-row>
                <b-button variant="dark" type="button" @click="plusIncentive" style="margin-left: 0px">
                  Novo incentivo
                </b-button>
              </b-form-row>


              <!-- Incentives rows -->
              <b-form-row v-for="(incentive, idx) in form.incentives" :key="idx" style="border-bottom: solid; border-color: black">

                  <b-col cols="3">
                    <h5> {{idx+1}}º Incentivo </h5>
                    <b-form-group label="Nome" :label-for="'name-'+idx">
                      <b-input-group>
                        <input :id="'name-'+idx"
                              v-model="form.incentives[idx].name" 
                              :ref="'name-'+idx"
                              class="form-control input-transparent pl-3"
                              type="text"
                              placeholder=""/>
                      </b-input-group>
                    </b-form-group>
                  </b-col>

                  <b-col cols="4" style="margin-top: 30px">
                    <b-form-group label="Tipo" v-slot="{ ariaDescribedby }" :label-for="'type-'+idx">
                      <b-form-radio-group
                        :id="'type-'+idx"
                        v-model="form.incentives[idx].type" 
                        :options="typeOptions"
                        :aria-describedby="ariaDescribedby"
                        style="margin-top: 15px"
                      ></b-form-radio-group>
                    </b-form-group>
                    <!-- Incentive Options -->
                    <div v-if="form.incentives[idx].type === 'private'">
                      <span style="margin-right: 15px"> Opções </span>
                      <b-button variant="dark" @click="addOption(idx)"> Nova opção </b-button>

                      <div style="margin-top: 12px">
                        <b-form-row v-for="(option, option_idx) in form.incentives[idx].options" :key="option_idx">
                          <b-form-group>
                            <b-input-group>

                              <input :id="'type-'+idx+'-'+option_idx"
                                    v-model="form.incentives[idx].options[option_idx].name" 
                                    :ref="'type-'+idx+'-'+option_idx"
                                    class="form-control input-transparent pl-3"
                                    type="text"
                                    placeholder="Opção"/>
                          
                              <button type="button" class="btn btn-default" @click="removeOption(idx, option_idx)" style="margin-left: 6px">
                                <span class="glyphicon glyphicon-minus"></span>
                              </button>
                          
                            </b-input-group>
                          </b-form-group>
                        </b-form-row>
                      </div>

                    </div>
                  </b-col>

                  <b-col cols="4" style="margin-top: 30px">
                    <b-form-group label="Comentário" :label-for="'comment-'+idx">
                      <b-input-group>
                        <textarea :id="'comment-'+idx"
                              v-model="form.incentives[idx].comment" 
                              :ref="'comment-'+idx"
                              class="form-control input-transparent pl-3"
                              type="textarea"
                              maxlength="300"
                              rows="7"
                              style="resize: none;"
                              placeholder=""/>
                      </b-input-group>
                    </b-form-group>
                  </b-col>

                <b-col cols="1" style="margin-top: 30px">
                  <button type="button" class="btn btn-default" @click="minusIncentive(idx)" style="margin-left: 6px; margin-top: 31px">
                    <span class="glyphicon glyphicon-remove"></span>
                  </button>
                </b-col>

              </b-form-row>
            </div>

            <!-- Submit -->
            <b-form-row style="margin-top: 20px">
              <small>*Não encontrou seu jogo na lista? Nos informe seu nome e ano de lançamento para adicionarmos!</small>
            </b-form-row>
            
            <b-form-row>
              <b-button type="submit" variant="danger" class="auth-btn" size="sm">
                <span class="auth-btn-circle">
                  <i class="la la-caret-right"></i>
                </span>
                Enviar
              </b-button>
            </b-form-row>

          </form>
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
  name: 'RunSubmit',
  data() {
    return {
      //Submit Error Message
      errorMessage: null,

      //Autocomplete Variables
      items: [],
      isOpen: false,
      results: [],
      arrowCounter: -1,

      //Incentives Variables
      toggleIncentives: false,
      typeOptions: [
        { text: 'Sem Múltipla Escolha', value: 'none' },
        { text: 'Escolha do Público', value: 'public' },
        { text: 'Escolha do Runner', value: 'private' },
      ],

      //Time Slot Checkbox Components
      timeSlots: ['manha'],
      timeSlotOptions: [
        { text: 'Manhã', value: 'manha' },
        { text: 'Tarde', value: 'tarde' },
        { text: 'Noite', value: 'noite' },
        { text: 'Madrugada', value: 'madrugada' }
      ],

      //Variables that will be submitted on form
      form: {
        category: '',
        estimatedTime: '',
        timeSlot: '',
        platform: '',

        gameId: null,
        gameName: '',
        gameYear: '',

        incentives: [
          {
            type: 'none',
            comment: '',
            name: '',
            options: [
              {
                name: '',
              },
            ]
          },
        ]
      },
      
      //Variables for input validation
      errors: {
        category: null,
        estimatedTime: null,
        platform: null,

        gameId: null,
        gameName: null,
        gameYear: null
      }
    }
  },
  methods: {
    //Autocomplete Methods
    handleClickOutside(evt) {
      if(evt.target.id !== "gameName"){
        this.isOpen = false;
        this.arrowCounter = -1;
      }
    },
    onArrowDown() {
      if (this.arrowCounter < this.results.length) {
        this.arrowCounter = this.arrowCounter + 1;
      }
    },
    onArrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter = this.arrowCounter - 1;
      }
    },
    onEnter() {
      this.form.gameName = this.results[this.arrowCounter];
      this.isOpen = false;
      this.arrowCounter = -1;
    },
    onChange() {
      this.isOpen = true;
      this.filterResults();
      for(let game in this.gamesList){
        if(this.gamesList[game].name === this.form.gameName){
          this.form.gameYear = this.gamesList[game].year;
          continue;
        }
      }
    },
    filterResults() {
      this.results = this.items.filter(item => item.toLowerCase().indexOf(this.form.gameName.toLowerCase()) > -1);
      if(this.results.length === 0 || this.form.gameName === ''){ this.isOpen = false}
    },
    setResult(result) {
        this.form.gameName = result;
        this.isOpen = false;
    },

    //Submit Request Methods
    async submit() {
      if(this.inputValidation()){
        let formatTime = this.form.estimatedTime.split(':');
        let estimatedSeconds = 0;
        if(formatTime[0]) estimatedSeconds += Number(formatTime[0]) * 3600;
        if(formatTime[1]) estimatedSeconds += Number(formatTime[1]) * 60;
        if(formatTime[2]) estimatedSeconds += Number(formatTime[2]);

        for(let game in this.gamesList){
          if(this.form.gameName === this.gamesList[game].name){
            this.form.gameYear = this.gamesList[game].year;
            this.form.gameId = this.gamesList[game].id;
            continue;
          }
        }

        //Manhã     = 1000;
        //Tarde     = 0100;
        //Noite     = 0010;
        //Madrugada = 0001;
        this.form.timeSlot = '';
        this.timeSlots.includes('manha') ? this.form.timeSlot += 1 : this.form.timeSlot += 0;
        this.timeSlots.includes('tarde') ? this.form.timeSlot += 1 : this.form.timeSlot += 0;
        this.timeSlots.includes('noite') ? this.form.timeSlot += 1 : this.form.timeSlot += 0;
        this.timeSlots.includes('madrugada') ? this.form.timeSlot += 1 : this.form.timeSlot += 0;

        let wsPayload = null;
        if(this.form.gameId !== null){
          wsPayload = {"endpoint":"createRun", "id":this.curReq, "info":{
            "runner_id": this.userId,

            "game_id": this.form.gameId,
            "category": this.form.category, 
            "estimated_time": estimatedSeconds, 
            "preferred_time_slot": this.form.timeSlot,
            "platform": this.form.platform,
            
            "incentives": []
            }
          };
        }else{
          wsPayload = {"endpoint":"createRunNGame", "id":this.curReq, "info":{
            "runner_id": this.userId,

            "category": this.form.category, 
            "estimated_time": estimatedSeconds, 
            "preferred_time_slot": this.form.timeSlot,
            "platform": this.form.platform,

            "name": this.form.gameName,
            "year":this.form.gameYear,

            "incentives": []
            }
          };
        }

        for(let idx in this.form.incentives){
          if(this.form.incentives[idx].type && this.form.incentives[idx].comment){
            wsPayload.info.incentives.push(this.form.incentives[idx]);
          }
        }

        this.$store.commit('layout/SOCKET_SEND', wsPayload);
        this.form.gameId = null;
        this.$router.push('/app/dashboard');
      }
    },
    inputValidation(){
      let validationCheck = true;

      for(let element in this.errors){
        this.errors[element] = null;
      }

      if(!this.form.gameName || /^\s*$/.test(this.form.gameName)) {
        this.errors.gameName = 'Nome do jogo: Campo obrigatório';
        validationCheck = false
      }
      if(!this.form.gameYear || /^\s*$/.test(this.form.gameYear)) {
        this.errors.gameYear = 'Ano de lançamento: Campo obrigatório';
        validationCheck = false
      }
      if(!this.form.category || /^\s*$/.test(this.form.category)) {
        this.errors.category = 'Categoria: Campo obrigatório';
        validationCheck = false
      }
      if(!this.form.estimatedTime || /^\s*$/.test(this.form.estimatedTime)) {
        this.errors.estimatedTime = 'Tempo estimado: Campo obrigatório';
        validationCheck = false
      }
      if(!this.form.platform || /^\s*$/.test(this.form.platform)) {
        this.errors.platform = 'Plataforma: Campo obrigatório';
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

    //Incentive Creation Methods
    showIncentives(){
      this.toggleIncentives = !this.toggleIncentives;
    },
    minusIncentive(idx){
      this.form.incentives.splice(idx, 1);
    },
    plusIncentive(){
      this.form.incentives.push({type: 'none', comment: '', name: '', options: [{ name: '' }]});
    },
    addOption(idx){
      this.form.incentives[idx].options.push({name: ''});
    },
    removeOption(idx, option_idx){
      this.form.incentives[idx].options.splice(option_idx, 1);
    }
  },
  computed:{
    ...mapState('layout', {
      curReq: state => state.curReq,
      gamesList: state => state.gamesList,
      userId: state => state.id,
    }),
  },
  async created(){
    const wsPayload = {"endpoint":"getGames", "id":this.curReq, "info":{}};
    this.$store.commit('layout/SOCKET_SEND', wsPayload);
    for(let game in this.gamesList){
      this.items.push(this.gamesList[game].name);
    }
  },
  mounted(){
    document.addEventListener('click', this.handleClickOutside);
  },
  destroyed() {
    document.removeEventListener('click', this.handleClickOutside);
  }
};
</script>

<style>
  .autocomplete {
    position: relative;
  }

  .autocomplete-results {
    padding: 0;
    margin: 0;
    margin-left: 0.5%;
    border: 3px solid #15172e;
    border-radius: 1%;
    max-height: 130px;
    width: 99%;
    overflow: hidden;
    position: absolute;
    background-color: #1b1c3a;
    overflow-y: auto;
    z-index: 10;
  }
  
  .autocomplete-results::-webkit-scrollbar {
    display: none;
  }
  .autocomplete-results {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 4px 2px;
  cursor: pointer;
}

.autocomplete-result:hover {
  background-color: #15172e;
  color: white;
}

.autocomplete-result.is-active,
.autocomplete-result:hover {
  background-color: #15172e;
  color: white;
}

/* Input Validation    */
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
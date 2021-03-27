<template>
  <div>
    <b-modal 
      id='donation-modal' 
      title="Janela de doação"
      centered
      ok-variant="dark"
      cancel-variant="dark"
      ok-title="Confirmar"
      cancel-title="Cancelar"
      @cancel="close"
      @close="close"
      @ok="confirm"
      no-close-on-esc
      no-close-on-backdrop>

        <form autocomplete="off" novalidate class="mt" @submit.prevent="submit">
          <!-- Fomulário -->
          <b-form-group label="" label-for="first_name">
            <b-input-group>
              <b-input-group-text slot="prepend"><i class="la la-user text-white"></i></b-input-group-text>
              <input id="first_name"
                     v-model="form.firstName"
                     v-bind:class="{ invalid: errors.firstName !== null }"
                     ref="first_name"
                     class="form-control input-transparent pl-3"
                     type="text"
                     required
                     placeholder="Nome"/>
            </b-input-group>
            <small v-show="errors.firstName" class="errormsg"> {{ errors.firstName ? errors.firstName : "" }} </small>
          </b-form-group>

          <b-form-group label="" label-for="last_name">
            <b-input-group>
              <b-input-group-text slot="prepend"><i class="la la-user text-white"></i></b-input-group-text>
              <input id="last_name"
                     v-model="form.lastName"
                     v-bind:class="{ invalid: errors.lastName !== null }"
                     ref="last_name"
                     class="form-control input-transparent pl-3"
                     type="text"
                     required
                     placeholder="Sobrenome"/>
            </b-input-group>
            <small v-show="errors.lastName" class="errormsg"> {{ errors.lastName ? errors.lastName : "" }} </small>
          </b-form-group>

          <b-form-group label="" label-for="email">
            <b-input-group>
              <b-input-group-text slot="prepend"><i class="la la-user text-white"></i></b-input-group-text>
              <input id="email"
                     v-model="form.email"
                     v-bind:class="{ invalid: errors.email !== null }"
                     ref="email"
                     class="form-control input-transparent pl-3"
                     type="text"
                     required
                     placeholder="E-mail"/>
            </b-input-group>
            <small v-show="errors.email" class="errormsg"> {{ errors.email ? errors.email : "" }} </small>
          </b-form-group>

          <b-form-group label="" label-for="value">
            <b-input-group>
              <b-input-group-text slot="prepend"><i class="la la-user text-white"></i></b-input-group-text>
              <input id="value"
                     v-model="form.value"
                     v-bind:class="{ invalid: errors.value !== null }"
                     ref="value"
                     class="form-control input-transparent pl-3"
                     type="text"
                     required
                     placeholder="Valor"/>
            </b-input-group>
            <small v-show="errors.value" class="errormsg"> {{ errors.value ? errors.value : "" }} </small>
          </b-form-group>

          <!-- Run Selector -->
          <b-form-row>
            <b-form-select v-model="selectedRun" class="mb-3">
              <b-form-select-option :value="null"> Por favor, escolha uma run. </b-form-select-option>
              <b-form-select-option v-for="(run, idx) in schedule" :key="idx" :value=run.id> {{ run.game }} {{ run.runner }} </b-form-select-option>
            </b-form-select>
            <small v-show="errors.run" class="errormsg"> {{ errors.run ? errors.run : "" }} </small>
          </b-form-row>

          <b-form-row style="margin-top: 15px">
            <b-form-select v-if="runIncentives.length > 0 && selectedRun !== null" v-model="selectedIncentive" class="mb-3">
              <b-form-select-option :value="null"> Por favor, escolha um incentivo. </b-form-select-option>
              <b-form-select-option v-for="(incentive, idx) in runIncentives" :key="idx" :value=incentive.id> {{ incentive.incentive }} </b-form-select-option>
            </b-form-select>
            <small v-show="errors.incentive" class="errormsg"> {{ errors.incentive ? errors.incentive : "" }} </small>
          </b-form-row>

          <b-form-row v-if="selectedIncentive && optionsArray.length > 0" style="margin-top: 15px">
            <b-form-select v-model="selectedOption" class="mb-3">
              <b-form-select-option :value="null"> Por favor, escolha uma opção. </b-form-select-option>
              <b-form-select-option 
                v-for="option in optionsArray" 
                :key="option" 
                :value=option> {{ option }} </b-form-select-option>
            </b-form-select>
            <small v-show="errors.option" class="errormsg"> {{ errors.option ? errors.option : "" }} </small>
          </b-form-row>

          <b-form-row v-if="loading" style="margin-top: 15px">
            <div class="spinner-border" role="status" > </div>
          </b-form-row>
        </form>

    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Donation',
  data() {
    return{
      loading: false,

      selectedRun: null,

      selectedIncentive: null,

      selectedOption: null,

      form: {
        /*
        firstName: 'vitor',
        lastName: 'costa',
        email: 'vitor@gmail.com',
        value: '100',
        */
        firstName: '',
        lastName: '',
        email: '',
        value: '',
      },

      errors: {
        firstName: null,
        lastName: null,
        email: null,
        value: null,
        run: null,
        incentive: null,
        option: null,
      }
    }
  },
  props: ['runScheduleId'],
  methods: {
    close() {
      this.$emit('closeDonation');
    },
    confirm(evt){
      evt.preventDefault();
      this.loading = true;
      if(this.inputValidation()){
        const wsPayload = {
          "endpoint":"updateIncentiveDonation", 
          "id":this.curReq, 
          "info":{
            "first_name": this.form.firstName, 
            "last_name": this.form.lastName, 
            "email": this.form.email, 
            "value": this.form.value, 
            "incentive_id": this.selectedIncentive,
            "option": this.selectedOption
          }
        }
        this.$store.commit('layout/SOCKET_SEND', wsPayload);
      }
      this.loading = false;
    },
    inputValidation(){
      let validationCheck = true;

      for(let element in this.errors){
        this.errors[element] = null;
      }

      if(!this.form.firstName || /^\s*$/.test(this.form.firstName)) {
        this.errors.firstName = 'Campo obrigatório';
        validationCheck = false
      }
      if(!this.form.lastName || /^\s*$/.test(this.form.lastName)) {
        this.errors.lastName = 'Campo obrigatório';
        validationCheck = false
      }
      if(!this.form.email || /^\s*$/.test(this.form.email)) {
        this.errors.email = 'Campo obrigatório';
        validationCheck = false
      }
      if(!this.form.value || /^\s*$/.test(this.form.value)) {
        this.errors.value = 'Campo obrigatório';
        validationCheck = false
      }

      if(this.schedule.length > 0 && !this.selectedRun){
        this.errors.run = 'Por favor, escolha uma run';
        validationCheck = false
        return validationCheck;
      }

      if(this.runIncentives.length > 0 && !this.selectedIncentive){
        this.errors.incentive = 'Por favor, escolha um incentivo.';
        validationCheck = false
      }

      if(this.optionsArray && this.optionsArray.length > 0 && !this.selectedOption){
        this.errors.option = 'Por favor, escolha uma opção.';
        validationCheck = false
      }


      return validationCheck;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$bvModal.show('donation-modal');
    })
  },
  computed:{
    ...mapState('layout', {
      curReq: state => state.curReq,
      runIncentives: state => state.runIncentives,
      schedule: state => state.schedule,
    }),
    optionsArray: function() {
      return this.selectedIncentive ? this.runIncentives.find(element => element.id === this.selectedIncentive).options : null;
    },
  },
  watch:{
    selectedRun: function(){
      if(this.selectedRun !== null){
        let wsPayload = {"endpoint":"getRunIncentives", "id":this.curReq, "info":{"id": this.selectedRun}};
        this.$store.commit('layout/SOCKET_SEND', wsPayload);
      }
      this.selectedIncentive = null;
      this.selectedOption = null;
    }
  },
  created(){
    //let wsPayload = {"endpoint":"getRunIncentives", "id":this.curReq, "info":{"id": this.runScheduleId}};
    //this.$store.commit('layout/SOCKET_SEND', wsPayload);
  }
}
</script>
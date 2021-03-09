import AuthService from '@/service/AuthService'
import UserService from '@/service/UserService'
import router from '../Routes'

export default {
  namespaced: true,
  state: {
    sidebarClose: true,
    sidebarActiveElement: null,

    curReq: 1,
    authToken: null,
    authenticate: false,
    wsState: 3,
    authError: null,

    //information arrays
    userList: [],
    gamesList: [],
    eventsList: [],
    extrasList: [],
    userRuns: [],
    schedule: [],
    submittedRuns: [],
    runIncentives: [],
    eventRunsList: [],

    //current user
    id:'',
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    gender: '',
    phone_number: '',
    stream_link: '',
    twitch: '',
    twitter: '',
    facebook: '',
    instagram: '',
    youtube: '',
    permissions: ['admin'],
  },

  mutations: {
    switchSidebar(state, value) {
      if (value) {
        state.sidebarClose = value;
      } else {
        state.sidebarClose = !state.sidebarClose;
      }
    },
    changeSidebarActive(state, index) {
      state.sidebarActiveElement = index;
    },
    authLogin(state, token){
      state.authToken = token;
    },
    authError(state, error){
      state.authError = error;
    },
    loadUser(state, {id, first_name, last_name, username, email, gender, phone_number, stream_link, twitch, twitter, facebook, instagram, youtube, permissions}){
      state.id = id;
      state.first_name = first_name;
      state.last_name = last_name;
      state.username = username;
      state.email = email;
      state.gender = gender;
      state.phone_number = phone_number;
      state.stream_link = stream_link;
      state.twitch = twitch;
      state.twitter = twitter;
      state.facebook = facebook;
      state.instagram = instagram;
      state.youtube = youtube;
      state.permissions = permissions;
    },
    authenticate(state){
      state.authenticate = true;
      router.push('/app/dashboard');
    },
    listUsers(state, payload){
      state.userList = payload[0];
    },
    listGames(state, payload){
      state.gamesList = payload[0];
    },
    //Event
    listEvents(state, payload){
      state.eventsList = payload[0];
    },
    updateEventState(state, payload){
      state.eventsList.filter(element => element.id === payload[0].id)[0].active = payload[0].active;
    },
    pushNewEvent(state, payload){
      state.eventsList.push(payload[0]);
    },
    updateEvent(state, payload){
      state.eventsList.filter(element => element.id === payload[0].id)[0].active = payload[0].active;
      state.eventsList.filter(element => element.id === payload[0].id)[0].donation_link = payload[0].donation_link;
      state.eventsList.filter(element => element.id === payload[0].id)[0].end = payload[0].end;
      state.eventsList.filter(element => element.id === payload[0].id)[0].name = payload[0].name;
      state.eventsList.filter(element => element.id === payload[0].id)[0].start = payload[0].start;
    },

    listExtras(state, payload){
      state.extrasList = payload[0];
    },
    listUserRuns(state, payload){
      //state.userRuns = payload[0][0]; //js
      //state.userRuns = payload[0]; //ts
      
      if(payload[0][0].length) state.userRuns = payload[0][0];
      else state.userRuns = payload[0];
    },
    listSchedule(state, payload){
      state.schedule = payload[0];
    },
    listEventRuns(state, payload){
      state.eventRunsList = payload;
    },
    //Submit Runs
    listSubmitRuns(state, payload){
      //console.log(payload[0]);
      state.submittedRuns = payload[0];
    },
    updateSubmitRun(state, payload){
      state.submittedRuns.filter(element => element.id === payload[0].id)[0].reviewed = payload[0].reviewed;
      state.submittedRuns.filter(element => element.id === payload[0].id)[0].approved = payload[0].approved;
      state.submittedRuns.filter(element => element.id === payload[0].id)[0].waiting = payload[0].waiting;
    },
    updateSubmitRunIncentives(state, payload){
      state.submittedRuns.filter(element => element.id === payload[0].id)[0].reviewed = payload[0].reviewed;
      state.submittedRuns.filter(element => element.id === payload[0].id)[0].approved = payload[0].approved;
      state.submittedRuns.filter(element => element.id === payload[0].id)[0].waiting = payload[0].waiting;
      state.submittedRuns.filter(element => element.id === payload[0].id)[0].approved_incentives = payload[0].approved_incentives;
      state.submittedRuns.filter(element => element.id === payload[0].id)[0].goals = payload[0].goals;
    },
    removeIncentives(state, payload){
      let incentives = state.submittedRuns.filter(element => element.id === payload[0].id)[0].approved_incentives;
      for(let incentive in incentives){
        incentives[incentive] = false;
      }
    },
    //Incentives
    updateIncentive(state, payload){
      let incentive = state.submittedRuns.find(el1 => el1.incentives.find(el2 => el2.id === payload[0].id)).incentives.find(element => element.id === payload[0].id);
      incentive.BidwarOptions = payload[0].bidwar_options;
      incentive.comment = payload[0].comment;
      incentive.name = payload[0].name;
    },
    listRunIncentives(state, payload){
      state.runIncentives = payload[0];
    },


    updateSchedule(state, payload){
      //console.log("diff", state.schedule.filter(({ id: id1 }) => !payload.some(({ id: id2 }) => id2 === id1)))
      //console.log("payload:", payload);
      //console.log("schedule:", state.schedule);
      for(let val in payload){
        payload[val].order = Number(val) + 1;
      }
      state.schedule = payload;
    },
    //Setter
    updateScheduleList(state, payload){
      //console.log("antes: ", state.schedule);
      //console.log("depois: ", payload);
      for(let val in payload){
        payload[val].order = Number(val) + 1;
      }
      state.schedule = payload;
    },
    SOCKET_SEND(state, message){
      console.log('message sent: ' + message);
      state.curReq++;
    },
    logout(state){
      //console.log(state);
      window.localStorage.setItem('authenticated', false);
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('curUser');
      state.authToken = null;
      state.authenticate = false;
      state.curReq = 1;
      state.id = '';
      state.first_name = '';
      state.last_name = '';
      state.username = '';
      state.email = '';
      state.gender = '';
      state.phone_number = '';
      state.stream_link = '';
      state.twitch = '';
      state.twitter = '';
      state.facebook = '';
      state.instagram = '';
      state.youtube = '';
      state.permissions = [];
      state.userList = [];
      state.gamesList = [];
      state.eventsList = [];
      state.extrasList = [];
      state.userRuns = [];
      state.schedule = [];
      state.submittedRuns = [];
      state.runIncentives = [],
      router.push('/login');
    },
    wsState(state, curState){
      state.wsState = curState;
    },
  },
  actions: {
    switchSidebar({ commit }, value) {
      commit('switchSidebar', value);
    },
    changeSidebarActive({ commit }, index) {
      commit('changeSidebarActive', index);
    },
    async authLogin({ commit, dispatch }, payload){
      const response = await AuthService.postLogin(payload.username, payload.password);
      commit('authError', null)
      if(response.data.error){
        commit('authError', response.data.error)
      }else{
        const token = response.data.token;
        if(token){
          window.localStorage.setItem('authenticated', true);
          window.localStorage.setItem('curUser', response.data.id);
          window.localStorage.setItem('token', token);
          commit('authLogin', token);
          await dispatch('loadUser', response.data.id);
        }
      }
    },
    async loadUser({ commit }, id){
      const user = await UserService.getUser(id);
      //const userData = user.data.res[0]; //ts
      //const userData = user.data.res[0][0]; //js

      let userData = null;
      if(user.data.res[0][0]) userData = user.data.res[0][0];
      else userData = user.data.res[0];
      
      commit('loadUser', {
        id: id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        username: userData.username,
        email: userData.email,
        gender: userData.gender,
        phone_number: userData.phone_number,
        stream_link: userData.stream_link,
        twitch: userData.twitch,
        twitter: userData.twitter,
        facebook: userData.facebook,
        instagram: userData.instagram,
        youtube: userData.youtube,
        permissions: userData.permissions,
      })
    },
    logoutAction({ commit }){
      commit('logout');
    }
  },
  getters: {
    schedule: state => {
      return state.schedule;
    }
  }
};

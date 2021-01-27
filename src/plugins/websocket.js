export default function websocket(){
  const wss = new WebSocket('ws://localhost:3000');
  return store => {
    wss.addEventListener('message', function (event){
      let payload = JSON.parse(event.data);
      switch(payload.endpoint){
          case "login":
            store.commit('layout/authenticate');
            break;
          case "getUsers":
            store.commit('layout/listUsers', payload.data);
            break;
          case "getGames":
            store.commit('layout/listGames', payload.data);
            break;
          case "getEvents":
            store.commit('layout/listEvents', payload.data);
            break;
          case "getEventExtras":
            store.commit('layout/listExtras', payload.data);
            break;
          case "getUserRuns":
            store.commit('layout/listUserRuns', payload.data);
            break;
          case "getEventSchedule":
            store.commit('layout/listSchedule', payload.data);
            break;
          //Schedule communication
          case "updateEventSchedule":
            store.commit('layout/updateScheduleList', payload.data[0].success);
            break;
          case "createSetupEventSchedule":
            store.commit('layout/updateScheduleList', payload.data[0].success);
            break;
          case "deleteEventSchedule":
            store.commit('layout/updateScheduleList', payload.data[0].success);
            break;
          default:
            console.log("Mensagem do servidor: ", payload);
            //store.commit('receiveData', payload);
            return;
      }
    });
    store.subscribe(mutation => {
      if (mutation.type === 'layout/SOCKET_SEND') {
        store.commit('layout/wsState', wss.readyState);
        wss.send(JSON.stringify(mutation.payload))
      }
    })
  }
}
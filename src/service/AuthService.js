import axios from 'axios'

export default {
  async postLogin (username, password){
    const response = await axios.post(process.env.VUE_APP_HTTP_ADDRESS+'/login' || 'http://localhost:3000/login', {
    username: username,
    password: password,
    }).catch(function (error){
      if(error.response){
        return error.response;
      }
    });
    return response;
  },

  async checkToken(token){
    const response = await axios.post(process.env.VUE_APP_HTTP_ADDRESS+'/token' || 'http://localhost:3000/token', {
      token: token,
      }).catch(function (error){
        if(error.response){
          return error.response;
        }
      });
      return response;
  }
}

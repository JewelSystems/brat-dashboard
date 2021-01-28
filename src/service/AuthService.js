import axios from 'axios'

export default {
  async postLogin (username, password){
    const response = await axios.post('http://localhost:3000/login', {
    username: username,
    password: password,
    }).catch(function (error){
      if(error.response){
        return error.response;
      }
    });
    return response;
  }
}

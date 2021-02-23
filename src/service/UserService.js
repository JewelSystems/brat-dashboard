import axios from 'axios'

export default {
  async postSignup (first_name, last_name, username, nickname, email, password, gender, birthday, phone_number, stream_link, twitch, twitter, facebook, instagram, youtube){
    const response = await axios.post(process.env.VUE_APP_HTTP_ADDRESS+'/user' || 'http://localhost:3000/user', {
      first_name: first_name,
      last_name: last_name,
      username: username,
      nickname: nickname,
      email: email,
      gender: gender,
      birthday: birthday,
      phone_number: phone_number,
      password: password,
      stream_link: stream_link,
      twitch: twitch,
      twitter: twitter,
      facebook: facebook,
      instagram: instagram,
      youtube: youtube,
    }).catch(function (error) {
      if (error.response) {
        return error.response
      }
      /*
      else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      */
    });
    return response;
  },
  async getUser(id){
    const response = await axios.get(process.env.VUE_APP_HTTP_ADDRESS+'/user/'+id || 'http://localhost:3000/user/'+id);
    return response;
  }
}

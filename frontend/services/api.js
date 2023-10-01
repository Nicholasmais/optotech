// api.js
const axios = require('axios'); // Ou use uma forma apropriada de importação se estiver em um ambiente específico

const baseApiUrl = 'http://localhost:8000';

function getUsers() {
  return axios.get(`${baseApiUrl}/users/`)
    .then(function (response) {
      return response.data; 
    })
    .catch(function (error) {
      throw error;
    });
}

function checkLogin(body) {
  return axios.post(`${baseApiUrl}/login/`, body)
    .then(function (response) {
      return response.data; 
    })
    .catch(function (error) {
      throw error; 
    });
}


module.exports = {
  getUsers: getUsers,
  checkLogin: checkLogin
};

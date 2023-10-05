// api.js
const axios = require('axios'); // Ou use uma forma apropriada de importação se estiver em um ambiente específico

const baseApiUrl = 'http://localhost:8000';

const getUsers = async() => {
  return await axios.get(`${baseApiUrl}/users/`)
    .then((response) => {
      return response.data; 
    })
    .catch((error) => {
      throw error;
    });
}

const checkLogin = async (body) => {
  try {
    const response = await axios.post(`${baseApiUrl}/login/`, body, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const checkedLogged = async() => {
  return await axios.get(`${baseApiUrl}/isLogged/`)
    .then((response) => {
      return response.data; 
    })
    .catch((error) => {
      throw error; 
    });
}


module.exports = {
  getUsers: getUsers,
  checkLogin: checkLogin,
  checkedLogged: checkedLogged
};

const axios = require('axios');
import Cookies from 'js-cookie'

const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:8000';

const getUsers = async() => {
  return await axios.get(`${baseApiUrl}/users/`)
    .then((response) => {
      return response.data; 
    })
    .catch((error) => {
      throw error;
    });
}

const login = async (body) => {
  try {
    const response = await axios.post(`${baseApiUrl}/login/`, body, {
      withCredentials: true,
      credentials: 'include'
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const signup = async (body) => {
  try {
    const response = await axios.post(`${baseApiUrl}/signup/`, body, {
      withCredentials: true,
      credentials: 'include'
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const logout = async (body) => {
  try {
    const response = await axios.post(`${baseApiUrl}/logout/`, body, {
      withCredentials: true,
      credentials: 'include'
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const isAuth = async() => {
  return await axios.get(`${baseApiUrl}/isAuth/`, {
    withCredentials: true,
    credentials: 'include'
  })
    .then((response) => {
      return response.data; 
    })
    .catch((error) => {
      throw error; 
    });
}

const setItem = async (key, value) => {
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + 1); // Adiciona 1 hora à data atual
  Cookies.set(key, value, { expires: expirationDate });
}

const removeItem = async (key) =>{
  Cookies.remove(key);
} 

function checkCookie(name) {
  const cookies = document.cookie.split('; ');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split('=');
    if (cookie[0] === name) {
      return cookie[1];
    }
  }
  return null;
}

function checkSessionCookie() {
  const sessionCookie = checkCookie('sessionid');
  const csrfToken = checkCookie('csrftoken');
  const isSession = sessionCookie !== null && sessionCookie !== '';
  const isCsrf = csrfToken !== null && csrfToken !== ''
  return isSession || isCsrf;
}

function clearCookie() {
  document.cookie = `sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

const appointment = async() => {
  try {
    const res = await axios.get(`${baseApiUrl}/appointment/`, {
      withCredentials: true,
      credentials: 'include'
    });
    return res.data;
  } catch (err){
    throw err
  }
}

const createAppointment = async(body) => {
  try {
    const res = await axios.post(`${baseApiUrl}/appointment/`, body, {
      withCredentials: true,
      credentials: 'include'
    });
    return res.data;
  } catch (err){
    throw err
  }
}

const updateData = async(body) => {
  try{
    const res = await axios.put(`${baseApiUrl}/update-data/`, body,  {
      withCredentials: true,
      credentials: 'include'
    })    
    return res.data;    
  } catch(err) {
    throw err
  }
}


const alunos = async() => {
  try {
    const res = await axios.get(`${baseApiUrl}/alunos/`, {
      withCredentials: true,
      credentials: 'include'
    });
    return res.data;
  } catch (err){
    throw err
  }
}

const createAluno = async(body) => {
  try {
    const res = await axios.post(`${baseApiUrl}/alunos/`, body, {
      withCredentials: true,
      credentials: 'include'
    });
    return res.data;
  } catch (err){
    throw err
  }
}

const updateAluno = async(body) => {
  try{
    const res = await axios.put(`${baseApiUrl}/alunos/`, body,  {
      withCredentials: true,
      credentials: 'include'
    })    
    return res.data;    
  } catch(err) {
    throw err
  }
}

const deleteAluno = async(body) => {
  try{
    const res = await axios.delete(`${baseApiUrl}/alunos/`, body,  {
      withCredentials: true,
      credentials: 'include'
    })    
    return res.data;    
  } catch(err) {
    throw err
  }
}


const MatrixLetter = async(letter) =>{
  try{
    let res;
    if (letter){
      res = await axios.get(`${baseApiUrl}/matrix-letter?letra=${letter}/`,
      {
        withCredentials:true,
        credentials:'include'
      });
    }
    else{
      res = await axios.get(`${baseApiUrl}/matrix-letter/`,
      {
        withCredentials:true,
        credentials:'include'
      });
    }
    return res.data;

  } catch(err) {
    throw err;
  }  
}

module.exports = {
  getUsers: getUsers,
  login: login,
  logout: logout,
  signup: signup,
  isAuth: isAuth,
  checkSessionCookie: checkSessionCookie,
  clearCookie: clearCookie,
  appointment: appointment,
  createAppointment: createAppointment,
  updateData: updateData,
  alunos: alunos,
  createAluno: createAluno,
  updateAluno: updateAluno,
  deleteAluno: deleteAluno,
  setItem: setItem,
  removeItem: removeItem,
  MatrixLetter: MatrixLetter
};

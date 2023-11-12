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

const pacientes = async() => {
  try {
    const res = await axios.get(`${baseApiUrl}/pacientes/`, {
      withCredentials: true,
      credentials: 'include'
    });
    return res.data;
  } catch (err){
    throw err
  }
}

const paciente = async(id) => {
  try {
    const res = await axios.get(`${baseApiUrl}/pacientes/${id}/`, {
      withCredentials: true,
      credentials: 'include'
    });
    return res.data;
  } catch (err){
    throw err
  }
}

const createPaciente = async(body) => {
  try {
    const res = await axios.post(`${baseApiUrl}/pacientes/`, body, {
      withCredentials: true,
      credentials: 'include'
    });
    return res.data;
  } catch (err){
    throw err
  }
}

const updatePaciente = async(body) => {
  try{
    const res = await axios.put(`${baseApiUrl}/pacientes/`, body,  {
      withCredentials: true,
      credentials: 'include'
    })    
    return res.data;    
  } catch(err) {
    throw err
  }
}

const deletePaciente = async(id) => {
  try{
    const res = await axios.delete(`${baseApiUrl}/pacientes/${id}`,  {
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

const reportComparison = async({isRight, isAllPatients}) => {

  const right = `${isRight === undefined ? "?isRight=true" : "?isRight=" + isRight}`;
  const allPatients = `${isAllPatients === undefined ? "isAllPatients=true" : "isAllPatients=" + isAllPatients}`;
  const params = `${right}${allPatients !== "" ? "&"  + allPatients : ""}`;

  return await axios.get(`${baseApiUrl}/report/comparison/${params}`, {
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

const reportActive = async() => {
  return await axios.get(`${baseApiUrl}/report/active`, {
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

const reportDemographic = async() => {
  return await axios.get(`${baseApiUrl}/report/demographic`, {
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

const reportMaxMinDate = async() => {
  return await axios.get(`${baseApiUrl}/report/max-min-date/`, {
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

const downloadFile = async() => {
  return await axios.get(`${baseApiUrl}/generate-dpi-script/`, {
    responseType: 'arraybuffer',
    withCredentials: true,
    credentials: 'include'
  })
    .then((response) => {      
      return response; 
    })
    .catch((error) => {
      throw error; 
    });
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
  pacientes: pacientes,
  paciente: paciente,
  createPaciente: createPaciente,
  updatePaciente: updatePaciente,
  deletePaciente: deletePaciente,
  setItem: setItem,
  removeItem: removeItem,
  MatrixLetter: MatrixLetter,
  reportComparison: reportComparison,
  reportActive: reportActive,
  reportDemographic: reportDemographic,
  reportMaxMinDate: reportMaxMinDate,
  downloadFile:downloadFile
};

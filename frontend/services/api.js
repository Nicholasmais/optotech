import Cookies from 'js-cookie'

const axios = require('axios');
const dotenv = require('dotenv');

// Configura o caminho do arquivo .env com base no diretório atual
const path = require('path');
const envPath = path.resolve(__dirname, '../.env.local');

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config({ path: envPath });

axios.default.withCredentials = true

const localBaseAPI = process.env.NEXT_PUBLIC_LOCAL_SSL || "http://localhost:8000";
const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API || localBaseAPI;

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

  Cookies.set(key, value, {
    expires: expirationDate,
    secure: true,
    sameSite: 'none',  
  });
  
}

const removeItem = async (key) =>{
  Cookies.remove(key);
} 

function clearCookie() {
  document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
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

const reportComparison = async({isRight, isAllPatients, initialDate, finalDate}) => {

  const right = `${isRight === undefined ? "?isRight=true" : "?isRight=" + isRight}`;
  const allPatients = `${isAllPatients === undefined ? "isAllPatients=true" : "isAllPatients=" + isAllPatients}`;
  const initialDateParam = initialDate ? `initialDate=${initialDate}` : null
  const finalDateParam = finalDate ? `finalDate=${finalDate}` : null

  const mandatoryParams = `${right}${allPatients !== "" ? "&"  + allPatients : ""}`;
  
  let params = mandatoryParams;
  if (initialDate){
    params += "&" + initialDateParam;
  }
  if (finalDate){
    params += "&" + finalDateParam;
  }

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

const reportActive = async({isAllPatients, initialDate, finalDate}) => {
  const allPatients = `?${isAllPatients === undefined ? "isAllPatients=true" : "isAllPatients=" + isAllPatients}`;
  const initialDateParam = initialDate ? `initialDate=${initialDate}` : null
  const finalDateParam = finalDate ? `finalDate=${finalDate}` : null

  const mandatoryParams = `${allPatients !== "" ? allPatients : ""}`;
  
  let params = mandatoryParams;
  if (initialDate){
    params += "&" + initialDateParam;
  }
  if (finalDate){
    params += "&" + finalDateParam;
  }

  return await axios.get(`${baseApiUrl}/report/active/${params}`, {
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

const reportDemographic = async({isRight, isAllPatients, initialDate, finalDate}) => {
  
  const right = `${isRight === undefined ? "?isRight=true" : "?isRight=" + isRight}`;
  const allPatients = `${isAllPatients === undefined ? "isAllPatients=true" : "isAllPatients=" + isAllPatients}`;
  const initialDateParam = initialDate ? `initialDate=${initialDate}` : null
  const finalDateParam = finalDate ? `finalDate=${finalDate}` : null

  const mandatoryParams = `${right}${allPatients !== "" ? "&"  + allPatients : ""}`;
  
  let params = mandatoryParams;
  if (initialDate){
    params += "&" + initialDateParam;
  }
  if (finalDate){
    params += "&" + finalDateParam;
  }

  return await axios.get(`${baseApiUrl}/report/demographic/${params}`, {
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

const reportPatientAppointments = async({patient, initialDate, finalDate, isRight}) => {
  const params = new URLSearchParams();

  if (initialDate) {
    params.append("initialDate", initialDate);
  }
  if (finalDate) {
    params.append("finalDate", finalDate);
  }
  if (patient) {
    params.append("patient", patient);
  }

  // Adiciona o parâmetro `isRight` com o valor apropriado
  params.append("isRight", isRight === undefined ? true : isRight);

  // Construa a URL final
  const url = `${baseApiUrl}/report/patient/?${params.toString()}`;

  // Faça a requisição
  return await axios.get(url, {
    withCredentials: true,
    credentials: "include",
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

const saveDpi = async(body) => {
  return await axios.patch(`${baseApiUrl}/users/`,body, {
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

const getCookies = async() => {
  return await axios.get(`${baseApiUrl}/getCookies/`, {
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
  reportPatientAppointments:reportPatientAppointments,
  reportMaxMinDate: reportMaxMinDate,
  downloadFile:downloadFile,
  saveDpi:saveDpi,
  getCookies:getCookies
};

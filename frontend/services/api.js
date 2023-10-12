const axios = require('axios');

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
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const isAuth = async() => {
  return await axios.get(`${baseApiUrl}/isAuth/`, {
    withCredentials: true,
  })
    .then((response) => {
      return response.data; 
    })
    .catch((error) => {
      throw error; 
    });
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
  return sessionCookie !== null && sessionCookie !== '';
}

function clearCookie() {
  document.cookie = `sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

const appointment = async() => {
  try {
    const res = await axios.get(`${baseApiUrl}/appointment/`, {
      withCredentials: true
    });
    return res.data;
  } catch (err){
    throw err
  }
}

const createAppointment = async(body) => {
  try {
    const res = await axios.post(`${baseApiUrl}/appointment/`, body, {
      withCredentials: true
    });
    return res.data;
  } catch (err){
    throw err
  }
}

const updateData = async(body) => {
  try{
    const res = await axios.put(`${baseApiUrl}/update-data/`, body,  {
      withCredentials: true
    })    
    return res.data;    
  } catch(err) {
    throw err
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
  updateData: updateData
};

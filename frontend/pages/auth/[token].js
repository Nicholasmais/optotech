import { useEffect } from 'react'
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

const api = require('../../services/api');

export default function AuthToken() {
  const { setAuthData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const setCookie = async() => {
      await api.setItem('sessionid', router.query.token).then(async() =>{
        await api.isAuth().then((res) => {
          setAuthData({
            isAuth: res.isAuth,
            user: res.user
          });
          router.push("/meus-dados");
        });        
      } );
    }
    setCookie();
  }, [router.query]);
}

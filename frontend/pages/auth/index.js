import { useEffect } from 'react'
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

const api = require('../../services/api');

export default function AuthToken() {
  const { setAuthData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const setCookie = async() => {
      await api.isAuth().then((res) => {
        setAuthData({
          isAuth: res.isAuth,
          user: res.user
        });
        res.user?.dpi ? 
        router.push("/meus-dados") : 
        router.push("/meus-dados/dpi");
      });        
    }
    setCookie();
  }, [router.query]);
}

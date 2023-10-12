import { useEffect } from 'react'
import { useRouter } from 'next/router';
import { setItem } from '../../services/api';

export default function AuthToken() {
  const router = useRouter();

  useEffect(() => {
    if (router.query) { 
      setItem('token', router.query.token);
      router.push('/')
    }
  }, [router.query]);
}

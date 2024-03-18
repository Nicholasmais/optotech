import '../styles/globals.scss';
import { AuthContextProvider } from '../contexts/AuthContext';

function OptoTech({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}

export default OptoTech;

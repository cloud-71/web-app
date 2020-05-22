import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';

//you need to make a custom app to be able to import global CSS in NextJS
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}


import {BrowserRouter} from 'react-router-dom'
import Routes from './Routes'
import 'bootstrap/dist/css/bootstrap.css';
import './Assets/scss/master.scss'
import Layout from 'Layout';

document.addEventListener('contextmenu', (e) => e.preventDefault());
function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes/>
      </Layout>
    </BrowserRouter>
  );
}

export default App;


import {BrowserRouter} from 'react-router-dom'
import Routes from './Routes'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import './Assets/scss/master.scss'
import Layout from 'Layout';

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

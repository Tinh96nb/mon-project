
import {BrowserRouter} from 'react-router-dom'
import Routes from './Routes'
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './Assets/scss/master.scss'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes/>
      </BrowserRouter>
    </>
  );
}

export default App;

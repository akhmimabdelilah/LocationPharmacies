
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './Components/Header';
import Main from './Components/Main';
import Footer from './Components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <div className='container mainApp my-3 py-3'>
        <Main />
      </div>
      <Footer />
    </div>
  );
}

export default App;

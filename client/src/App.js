import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './Components/Header';
import Main from './Components/Main';
import FooterComponent from './Components/Footer';

import Contact from './pages/Contact';
import About from './pages/About';
import NoPage from './pages/NoFoundPage';


function App() {
  return (
    <div className="App">
      <Header />
      <div className='container mainApp my-3 py-3'>
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index element={<Main />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
      <FooterComponent />
    </div>
  );
}

export default App;

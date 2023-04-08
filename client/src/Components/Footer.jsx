import { Container, Row, Col, Footer } from 'react-bootstrap';

import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";


const FooterComponent = () => {
    return(
        <footer className="footer px-3 fixed-bottom">
            <div className="footer_container row">
                <div className="col-6 py-3">
                    <div className='d-flex justify-content-center'>
                        <ul>
                            <li>Adresse: <strong>####</strong></li>
                            <li>Numéro de téléphone: <strong>0535442342</strong></li>
                            <li>Adresse e-mail: <strong>pharmecy@gmail.com</strong></li>
                        </ul>
                    </div>
                </div>
                <div className="col-6 py-3">
                    <div className='d-flex justify-content-center'>
                        <ul>
                            <li><FaFacebook/> <a href="#">Facebook</a></li>
                            <li><FaInstagram /> <a href="#">Twitter</a></li>
                            <li><FaTwitter /> <a href="#">Instagram</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default FooterComponent;
import '../Map.css';
import { MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';


const Map = (props) => {
    return (
        <Container fluid="sm" className='my-3'>
            <Row>
                <MapContainer center={[33.2472, -8.5067]} zoom={13} scrollWheelZoom={true} style={{ width: props.width, height: props.height }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {
                        props.data.map((item => {
                            console.log(item);
                            return(
                                <Marker position={[item.latitude, item.longitude]}>
                                    <Popup>
                                        <p>
                                            <strong>Nom:</strong> {item.name}
                                        </p>
                                        <p>
                                            <strong>Address:</strong> {item.address}
                                        </p>
                                    </Popup>
                                </Marker>
                            )
                        }))
                    }
                </MapContainer>
            </Row>
        </Container>
    )
}

export default Map;
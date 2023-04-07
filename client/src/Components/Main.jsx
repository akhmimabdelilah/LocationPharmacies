import {React, useEffect, useState} from 'react';
import { Formik, Form } from 'formik';
import Select from 'react-select'
import Button from 'react-bootstrap/Button';
import Cards from './Cards';


const gardeData = [
    { vale: 'dat', label: 'Day' },
    { value: 'night', label: 'Night' },
]

const defaultCity = { value: "city", label: "Select City" };
const defaultZone = { value: "zone", label: "Select City" };
const defaultGarde = { value: "garde", label: "Select Garde" };


const Main = () => {
    const [cities, setCities] = useState(null);
    const [city, setCity] = useState(null);
    const [zones, setZones] = useState(null);
    const [zone, setZone] = useState(null);
    const [garde, setGarde] = useState(null);
    const [pharmacies, setPharmacies] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:5050/api/cities')
            .then(response => response.json())
            .then(data => {
                const options = data.map(item => ({ value: item.id, label: item.name }));
                setCities(options);
            })
            .catch(error => console.error(error));

        fetch('http://127.0.0.1:5050/api/zones')
            .then(response => response.json())
            .then(data => {
                const options = data.map(item => ({ value: item.id, label: item.name }));
                setZones(options);
            })
            .catch(error => console.error(error));
    }, []);


    const isCity = !city;
    const isZone = !zone;

    const handleCityChange = data => {
        setCity(data);
        setZone(null);
    };

    const handleZoneChange = data => {
        setZone(data);
        setGarde(null);
    }

    const handleGardeChange = data => {
        setGarde(data);
        // get data from database
    }

    return(
        <div>
            <div className='d-flex justify-content-center'>
                <div className='mx-3 flex-grow-1'>
                    <Select
                        options={cities}
                        defaultValue={defaultCity}
                        value={city}
                        onChange={handleCityChange}
                    />
                </div>
                <div className='mx-3 flex-grow-1'>
                    <Select 
                        options={zones} 
                        defaultValue={defaultZone}
                        value={zone}
                        onChange={handleZoneChange}
                        isDisabled={isCity}
                    />
                </div>
                <div className='mx-3 flex-grow-1'>
                    <Select 
                        options={gardeData} 
                        defaultValue={defaultGarde}
                        value={garde}
                        onChange={handleGardeChange}
                        isDisabled={isZone}
                    />
                </div>
                <div className='mx-3'>
                    <Button type="submit" variant="outline-primary">Get</Button>
                </div>
            </div>

            <div className='cardsContainer row'>
                <Cards/>
            </div>
        </div>
    )
}

export default Main;
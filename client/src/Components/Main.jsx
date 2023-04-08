import {React, useEffect, useState, useReducer} from 'react';
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

const initialState = {
    cities: null,
    city: null,
    zones: null,
    zone: null,
    garde: null
  };

function reducer(state, action) {
    switch (action.type) {
      case 'SET_CITIES':
        return {...state, cities: action.payload};
      case 'SET_CITY':
        return {...state, city: action.payload};
      case 'SET_ZONES':
        return {...state, zones: action.payload};
      case 'SET_ZONE':
        return {...state, zone: action.payload};
      case 'SET_GARDE':
        return {...state, garde: action.payload};
      default:
        throw new Error(`Unsupported action type: ${action.type}`);
    }
}


const Main = () => {
    // const [cities, setCities] = useState(null);
    // const [city, setCity] = useState(null);
    // const [zones, setZones] = useState(null);
    // const [zone, setZone] = useState(null);
    // const [garde, setGarde] = useState(null);

    const [state, dispatch] = useReducer(reducer, initialState);
    const [pharmacies, setPharmacies] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:9000/api/cities')
            .then(response => response.json())
            .then(data => {
                const options = data.map(item => ({ value: item.id, label: item.name }));
                // setCities(options);
                dispatch({type: 'SET_CITIES', payload: options});
            })
            .catch(error => console.error(error));

        fetch('http://127.0.0.1:9000/api/zones')
            .then(response => response.json())
            .then(data => {
                const options = data.map(item => ({ value: item.id, label: item.name }));
                // setZones(options);
                dispatch({type: 'SET_ZONES', payload: options});
            })
            .catch(error => console.error(error));
    }, []);


    const isCity = !state.city;
    const isZone = !state.zone;

    const handleCityChange = data => {
        // setCity(data);
        // setZone(null);
        dispatch({type: 'SET_CITY', payload: data});
        dispatch({type: 'SET_ZONE', payload: null});
    };

    const handleZoneChange = data => {
        // setZone(data);
        // setGarde(null);
        dispatch({type: 'SET_ZONE', payload: data});
        dispatch({type: 'SET_GARDE', payload: null});
    }

    const handleGardeChange = data => {
        // setGarde(data);
        dispatch({type: 'SET_GARDE', payload: data});
    }

    return(
        <div>
            <div className='d-flex justify-content-center'>
                <div className='mx-3 flex-grow-1'>
                    <Select
                        options={state.cities}
                        defaultValue={defaultCity}
                        value={state.city}
                        onChange={handleCityChange}
                    />
                </div>
                <div className='mx-3 flex-grow-1'>
                    <Select 
                        options={state.zones} 
                        defaultValue={defaultZone}
                        value={state.zone}
                        onChange={handleZoneChange}
                        isDisabled={isCity}
                    />
                </div>
                <div className='mx-3 flex-grow-1'>
                    <Select 
                        options={gardeData} 
                        defaultValue={defaultGarde}
                        value={state.garde}
                        onChange={handleGardeChange}
                        isDisabled={isZone}
                    />
                </div>
                <div className='mx-3'>
                    <Button type="submit" variant="outline-primary">Get</Button>
                </div>
            </div>

            <div className='cardsContainer row mx-3'>
                <Cards/>
            </div>
        </div>
    )
}

export default Main;
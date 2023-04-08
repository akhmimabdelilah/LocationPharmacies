import {React, useEffect, useState, useReducer} from 'react';
import Select from 'react-select'
import Button from 'react-bootstrap/Button';
import Cards from './Cards';
import Map from './Map';


const gardeData = [
    { vale: 'jour', label: 'Jour' },
    { value: 'nuit', label: 'Nuit' },
]

const URL = 'http://127.0.0.1:9000';

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
    const [state, dispatch] = useReducer(reducer, initialState);
    const [pharmacies, setPharmacies] = useState(null);
    const [getData, setGetData] = useState(false);

    useEffect(() => {
        fetch(`${URL}/api/cities`)
            .then(response => response.json())
            .then(data => {
                const options = data.map(item => ({ value: item._id, label: item.name }));
                dispatch({type: 'SET_CITIES', payload: options});
            })
            .catch(error => console.error(error));

        fetch(`${URL}/api/zones`)
            .then(response => response.json())
            .then(data => {
                const options = data.map(item => ({ value: item._id, label: item.name }));
                dispatch({type: 'SET_ZONES', payload: options});
            })
            .catch(error => console.error(error));
    }, []);


    const isCity = !state.city;
    const isZone = !state.zone;
    const isGarde = !state.garde;

    const handleCityChange = data => {
        dispatch({type: 'SET_CITY', payload: data});
        dispatch({type: 'SET_ZONE', payload: null});
        setGetData(false);
    };

    const handleZoneChange = data => {
        dispatch({type: 'SET_ZONE', payload: data});
        dispatch({type: 'SET_GARDE', payload: null});
    }

    const handleGardeChange = data => {
        dispatch({type: 'SET_GARDE', payload: data});
    }

    const handleGetPharmacies = data => {
        // get pharmacies from mongodb
        fetch(`${URL}/api/pharmacies/${state.garde.value}/${state.zone.value}/${state.city.value}`)
            .then(response => response.json())
            .then(data => {
                if(data.length){
                    setPharmacies(data);
                }
                else{
                    console.log("empty");
                }
                setGetData(true);

                dispatch({type: 'SET_CITY', payload: null});
                dispatch({type: 'SET_ZONE', payload: null});
                dispatch({type: 'SET_GARDE', payload: null});
            })
            .catch(error => console.log(error));
    }

    const handleRestPharmacies = data => {
        setPharmacies(null);
        setGetData(false);

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
                    <Button 
                        onClick={handleGetPharmacies} 
                        variant="outline-primary"
                        disabled={isGarde}
                    >
                        Get
                    </Button>
                    <Button 
                        onClick={handleRestPharmacies} 
                        variant="outline-success"
                        // disabled={isGarde}
                        className='mx-2'
                    >
                        Rest
                    </Button>
                </div>
            </div>

            <div className='cardsContainer row mx-3 justify-content-center'>

                { getData ?
                    pharmacies?.length ?
                        <>
                            <Cards data={pharmacies}/>
                            <Map data={pharmacies} width={1000} height={500}/>
                        </>
                    :
                    <div>Not Found!</div>
                :
                    <div>
                        Search a Pharmacy
                    </div>
                }

            </div>
        </div>
    )
}

export default Main;
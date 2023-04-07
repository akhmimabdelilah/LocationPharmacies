
export async function GetCities() {
    const response = await fetch('127.0.0.1:5050/api/cities');
    const cities = await response.json();
    console.log("cities: ", response);
    return cities;
}

export async function GetCity(id) {
    const response = await fetch(`127.0.0.1:3000/api/cities/${id}`);
    const cities = await response.json();
    return cities;
}

export async function PostCity(requestOptions ) {
    return await fetch('127.0.0.1:3000/api/cities/', requestOptions );
}

export async function PutCity(id, requestOptions ) {
    return await fetch(`127.0.0.1:3000/api/cities/${id}`, requestOptions );
}

export async function DelCity(id) {
    return await fetch(`127.0.0.1:3000/api/cities/${id}`,  { method: 'DELETE'});
}
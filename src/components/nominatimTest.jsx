import React, { useState } from 'react';

function NominatimTest() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [city, setCity] = useState('');  
  const [error, setError] = useState(null); 

  const fetchLocation = async () => {
    if (!city) {
      setError('Please enter a city name!');
      return;
    }

    try {
      setError(null);  
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${city}&format=json&addressdetails=1`
      );

      
      if (!response.ok) {
        setError('Failed to fetch location data!');
        return;
      }

      const data = await response.json();

      if (data.length === 0) {
        setError('City not found!');
        setLocation(null); 
        setAddress(null); 
      } else {
        setLocation(data[0]);  
        setAddress(data[0].address);
      }
    } catch (err) {
      setError('An error occurred while fetching the location.');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Location Search</h2>
      <input
        type="text"
        placeholder="Enter a city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchLocation}>Get Location Info</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {location && (
        <div>
          <h3>Location Information:</h3>
          <p><strong>City:</strong> {address.city}</p>
          <p><strong>Country:</strong> {address.country}</p>
          <p><strong>Latitude:</strong> {location.lat}</p>
          <p><strong>Longitude:</strong> {location.lon}</p>
        </div>
      )}
    </div>
  );
}

export default NominatimTest;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [location, setLocation] = useState("");
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    birth_date: '',
    gender: '',
    phone_number: '',
    profile_picture_url: '',
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }, []);

  const success = async (position) => {
    const { latitude, longitude } = position.coords;
    setLatitude(latitude);
    setLongitude(longitude);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      if (!response.ok) throw new Error("Failed to fetch location.");
      const data = await response.json();
      setLocation(data.display_name);
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const error = (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setUserData((prevData) => ({
      ...prevData,
      profile_picture_url: url,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userDataWithLocation = {
      ...userData,
      location_latitude: latitude,
      location_longitude: longitude,
    };
  
    try {
    
      const response = await fetch('http://localhost:3000/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(userDataWithLocation), 
      });
  
      if (response.ok) {
        const data = await response.json();

      
        console.log("Registration successful");
        navigate('/');
      } else {
        const errorData = await response.json();
        console.error("Registration failed:", errorData.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            value={userData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={userData.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={userData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="first_name">First Name:</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            required
            value={userData.first_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="last_name">Last Name:</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            required
            value={userData.last_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="birth_date">Birth Date:</label>
          <input
            type="date"
            id="birth_date"
            name="birth_date"
            required
            value={userData.birth_date}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            name="gender"
            value={userData.gender}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="phone_number">Phone Number:</label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={userData.phone_number}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="profile_picture_url">Profile Image URL:</label>
          <input
            type="text"
            id="profile_picture_url"
            name="profile_picture_url"
            placeholder="Paste the profile image URL here"
            value={userData.profile_picture_url}
            onChange={handleUrlChange}
          />
        </div>
        <div>
          <label htmlFor="location">Location:</label>
          <input type="text" id="location" name="location" value={location} readOnly />
        </div>
        <div>
          <label htmlFor="location_latitude">Latitude:</label>
          <input type="text" id="location_latitude" name="location_latitude" value={latitude || ''} readOnly />
        </div>
        <div>
          <label htmlFor="location_longitude">Longitude:</label>
          <input type="text" id="location_longitude" name="location_longitude" value={longitude || ''} readOnly />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../styles/SelectInterest.css'
const SelectInterests = () => {
    const { authToken } = useAuth();
    const navigate = useNavigate();
  const [subcategories, setSubcategories] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const userId = localStorage.getItem('userId'); 
  useEffect(() => {
    const fetchSubcategories = async () => {
      const token = localStorage.getItem('authToken');
  
      if (!token) {
        alert('You need to log in first!');
        navigate('/'); 
        return;
      }
  
      try {
        const response = await fetch('http://localhost:3000/api/event/subcategories', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Subcategories fetched:', data);
          setSubcategories(data); 
        } else if (response.status === 401) {
          alert('Unauthorized! Please log in again.');
          navigate('/login'); 
        } else {
          console.error('Failed to fetch subcategories');
          setSubcategories([]);
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        setSubcategories([]);
      }
    };
  
    fetchSubcategories();
  }, []);
  const handleInterestToggle = (subcategoryId) => {
    setSelectedInterests((prev) =>
      prev.includes(subcategoryId)
        ? prev.filter((id) => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };
  useEffect(() => {
  const fetchSelectedInterests = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/user/interests', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedInterests(data.interests || []); 
      } else {
        console.error('Failed to fetch selected interests');
      }
    } catch (error) {
      console.error('Error fetching selected interests:', error);
    }
  };

  fetchSelectedInterests();
}, [authToken]);
const handleSave = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/user/interests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: JSON.stringify({ subcategoryIds: selectedInterests }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message || 'Interests saved successfully.');
            navigate('/profile'); 
        } else {
            alert(data.message || 'Failed to save interests');
        }
    } catch (error) {
        console.error('Error saving interests:', error);
        alert('An error occurred while saving interests.');
    }
};

return (
  <div>
    <h1>İlgi Alanlarınızı Seçin </h1>
    <h2>Önceki seçimleriniz yok sayılacaktır.</h2>
    <div className="container">
      {subcategories.map((subcategory) => (
        <div className="card" key={subcategory.id}>
          <label>
            <input
              type="checkbox"
              checked={selectedInterests.includes(subcategory.id)}
              onChange={() => handleInterestToggle(subcategory.id)}
            />
            {subcategory.name}
          </label>
        </div>
      ))}
    </div>
    <button onClick={handleSave}>Kaydet</button>
  </div>
);
};

export default SelectInterests;

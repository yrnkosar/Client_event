import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext'; // useAuth ile authToken'ı alıyoruz

function CategoryPage() {
  const { authToken } = useAuth(); // useAuth'tan authToken alıyoruz
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Kategorileri yükleme işlemi
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/api/event/categories', {
          headers: { Authorization: `Bearer ${authToken}` }, // Token'ı başlığa ekliyoruz
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('Yetkisiz işlem. Lütfen giriş yapın.');
          } else {
            setError('Kategoriler yüklenemedi.');
          }
          throw new Error('Kategoriler alınırken bir hata oluştu.');
        }

        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [authToken]);

  // Kategori ekleme işlemi
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryName) {
      setError('Kategori adı boş olamaz!');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/admin/add-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`, // Token'ı başlığa ekliyoruz
        },
        body: JSON.stringify({ name: categoryName }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Yetkisiz işlem. Lütfen giriş yapın.');
        } else {
          setError('Kategori oluşturulamadı.');
        }
        throw new Error('Kategori oluşturulamadı.');
      }

      const data = await response.json();
      setCategories([...categories, data]);
      setCategoryName('');
      setError('');
      alert('Kategori başarıyla eklendi.');
    } catch (err) {
      console.error(err);
    }
  };

  // Alt kategori ekleme işlemi
  const handleSubcategorySubmit = async (e) => {
    e.preventDefault();
    if (!subcategoryName || !selectedCategory) {
      setError('Alt kategori adı ve kategori seçmelisiniz.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/admin/add-subcategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`, // Token'ı başlığa ekliyoruz
        },
        body: JSON.stringify({ name: subcategoryName, categoryId: selectedCategory }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Yetkisiz işlem. Lütfen giriş yapın.');
        } else {
          setError('Alt kategori oluşturulamadı.');
        }
        throw new Error('Alt kategori oluşturulamadı.');
      }

      const data = await response.json();
      alert('Alt kategori başarıyla eklendi.');
      setSubcategoryName('');
      setSelectedCategory('');
      setError('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
      {/* Kategori Ekleme */}
      <div style={{ width: '48%' }}>
        <h2>Kategori Ekle</h2>
        <form onSubmit={handleCategorySubmit}>
          <div>
            <label>Kategori Adı:</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Kategori Ekle</button>
        </form>
      </div>

      {/* Alt Kategori Ekleme */}
      <div style={{ width: '48%' }}>
        <h2>Alt Kategori Ekle</h2>
        <form onSubmit={handleSubcategorySubmit}>
          <div>
            <label>Alt Kategori Adı:</label>
            <input
              type="text"
              value={subcategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Kategori Seç:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
            >
              <option value="">Kategori Seçiniz</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Alt Kategori Ekle</button>
        </form>
      </div>
    </div>
  );
}

export default CategoryPage;

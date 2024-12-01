import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext'; // useAuth ile authToken'ı alıyoruz
import styles from '../styles/category.module.css';

function CategoryPage() {
  const { authToken } = useAuth(); // useAuth'tan authToken alıyoruz
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [isSubcategoryModalOpen, setSubcategoryModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editSubcategory, setEditSubcategory] = useState(null);
  const [editCategory, setEditCategory] = useState(null); // Düzenlenecek kategori state'i
  const [isCategoryEditModalOpen, setCategoryEditModalOpen] = useState(false); // Kategori düzenleme modalı için state
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

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

  // Alt kategorileri yükleme
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/event/subcategories', {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (!response.ok) {
          setError('Alt kategoriler yüklenemedi.');
          throw new Error('Alt kategoriler alınırken bir hata oluştu.');
        }

        const data = await response.json();
        setSubcategories(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSubcategories();
  }, [authToken]);

  // Category creation handler
const handleCategorySubmit = async (e) => {
  e.preventDefault();
  if (!categoryName) {
    setError('Category name cannot be empty!');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/admin/add-categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`, // Attach token to header
      },
      body: JSON.stringify({ name: categoryName }),
    });

    if (!response.ok) {
      setError(response.status === 401 ? 'Unauthorized. Please login.' : 'Failed to create category.');
      throw new Error('Error creating category.');
    }

    const data = await response.json();
    setCategories([...categories, data]);
    setCategoryName('');
    setError('');
    alert('Category added successfully.');
  } catch (err) {
    console.error(err);
  }
};

// Subcategory creation handler
const handleSubcategorySubmit = async (e) => {
  e.preventDefault();
  if (!subcategoryName) {
    setError('Subcategory name cannot be empty!');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/admin/add-subcategory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`, // Attach token to header
      },
      body: JSON.stringify({ name: subcategoryName, categoryId: selectedCategoryId }),
    });

    if (!response.ok) {
      setError('Failed to create subcategory.');
      throw new Error('Error creating subcategory.');
    }

    const data = await response.json();
    setSubcategories([...subcategories, data]);
    setSubcategoryName('');
    setError('');
    alert('Subcategory added successfully.');
  } catch (err) {
    console.error(err);
  }
};

// Kategori silme işlemi
const handleDeleteCategory = async (categoryId) => {
  if (window.confirm('Kategoriyi silmek istediğinizden emin misiniz?')) {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        setError('Kategori silinemedi.');
        throw new Error('Kategori silinemedi.');
      }

      setCategories(categories.filter(category => category.id !== categoryId));
      alert('Kategori başarıyla silindi.');
    } catch (err) {
      console.error(err);
    }
  }
};

// Alt kategori silme işlemi
const handleDeleteSubcategory = async (subcategoryId) => {
  if (window.confirm('Alt kategoriyi silmek istediğinizden emin misiniz?')) {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/subcategories/${subcategoryId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        setError('Alt kategori silinemedi.');
        throw new Error('Alt kategori silinemedi.');
      }

      setSubcategories(subcategories.filter(subcategory => subcategory.id !== subcategoryId));
      alert('Alt kategori başarıyla silindi.');
    } catch (err) {
      console.error(err);
    }
  }
};
  // Kategori düzenleme işlemi
  const handleCategoryEdit = (category) => {
    setEditCategory(category);
    setCategoryName(category.name);
    setCategoryEditModalOpen(true); // Düzenleme modalını açıyoruz
  };

  const handleCategoryEditSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName) {
      setError('Kategori adı boş olamaz!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/admin/categories/${editCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ name: categoryName }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Yetkisiz işlem. Lütfen giriş yapın.');
        } else {
          setError('Kategori güncellenemedi.');
        }
        throw new Error('Kategori güncellenemedi.');
      }

      const updatedCategory = await response.json();
      setCategories(categories.map(cat => (cat.id === updatedCategory.id ? updatedCategory : cat)));
      setCategoryName('');
      setCategoryEditModalOpen(false); // Modalı kapatıyoruz
      setError('');
      alert('Kategori başarıyla güncellendi.');
    } catch (err) {
      console.error(err);
    }
  };
  // Alt kategori düzenleme işlemi
  const handleEditSubcategory = (subcategory) => {
    setEditSubcategory(subcategory);
    setSubcategoryName(subcategory.name);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!subcategoryName) {
      setError('Alt kategori adı boş olamaz!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/admin/subcategories/${editSubcategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`, // Token'ı başlığa ekliyoruz
        },
        body: JSON.stringify({ name: subcategoryName }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Yetkisiz işlem. Lütfen giriş yapın.');
        } else {
          setError('Alt kategori güncellenemedi.');
        }
        throw new Error('Alt kategori güncellenemedi.');
      }

      const updatedSubcategory = await response.json();
      setSubcategories(subcategories.map(subcat => (subcat.id === updatedSubcategory.id ? updatedSubcategory : subcat)));
      setSubcategoryName('');
      setEditModalOpen(false);
      setError('');
      alert('Alt kategori başarıyla güncellendi.');
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className={styles.container}>
      <h1>Kategoriler</h1>

      {/* Kategori ve alt kategori ekleme butonları */}
      <button onClick={() => setCategoryModalOpen(true)}>Kategori Ekle</button>
      <button onClick={() => setSubcategoryModalOpen(true)}>Alt Kategori Ekle</button>

      <h2>Kategoriler</h2>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Kategori Adı</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>
                  <button onClick={() => handleCategoryEdit(category)}>Düzenle</button>
                  <button onClick={() => handleDeleteCategory(category.id)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Alt Kategoriler</h2>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Alt Kategori Adı</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {subcategories.map((subcategory) => (
              <tr key={subcategory.id}>
                <td>{subcategory.name}</td>
                <td>
                  <button onClick={() => handleEditSubcategory(subcategory)}>Düzenle</button>
                  <button onClick={() => handleDeleteSubcategory(subcategory.id)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Kategori Ekle Modal */}
      {isCategoryModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Kategori Ekle</h3>
            <form onSubmit={handleCategorySubmit}>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Kategori adı"
                required
              />
              <button type="submit">Ekle</button>
              <button onClick={() => setCategoryModalOpen(false)}>Kapat</button>
            </form>
          </div>
        </div>
      )}

      {/* Kategori Düzenle Modal */}
      {isCategoryEditModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Kategori Düzenle</h3>
            <form onSubmit={handleCategoryEditSubmit}>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Kategori adı"
                required
              />
              <button type="submit">Güncelle</button>
              <button onClick={() => setCategoryEditModalOpen(false)}>Kapat</button>
            </form>
          </div>
        </div>
      )}

 {/* Alt Kategori Ekle Modal */}
 {isSubcategoryModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Alt Kategori Ekle</h3>
            <form onSubmit={handleSubcategorySubmit}>
              <input
                type="text"
                value={subcategoryName}
                onChange={(e) => setSubcategoryName(e.target.value)}
                placeholder="Alt kategori adı"
                required
              />
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                required
              >
                <option value="">Kategori Seçin</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button type="submit">Ekle</button>
              <button onClick={() => setSubcategoryModalOpen(false)}>Kapat</button>
            </form>
          </div>
        </div>
      )}

      {/* Alt Kategori Düzenle Modal */}
      {isEditModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Alt Kategori Düzenle</h3>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                value={subcategoryName}
                onChange={(e) => setSubcategoryName(e.target.value)}
                placeholder="Alt kategori adı"
                required
              />
              <button type="submit">Güncelle</button>
              <button onClick={() => setEditModalOpen(false)}>Kapat</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryPage;

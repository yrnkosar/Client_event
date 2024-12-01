import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate , Link } from 'react-router-dom';
import '../styles/UserListPage.css';

const UserListPage = () => {
  const { authToken, role, logout } = useAuth(); // AuthContext'ten authToken ve role alınıyor
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Yükleme durumu
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [modalUser, setModalUser] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/admin/users', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Kullanıcı verileri alınamadı:', error);
      }
    };

    fetchUsers();
  }, [authToken]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Arama yapıldığında ilk sayfaya dön
  };

 

  const filteredUsers = users.filter(
    (user) =>
      (user.first_name && user.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const openModal = (user) => {
    setModalUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalUser(null);
    setModalOpen(false);
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:3000/api/admin/delete-user/${userId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Hata: ${response.status} - ${errorData.message}`);
        }

        setUsers(users.filter((user) => user.id !== userId)); // Kullanıcıyı sil
      } catch (error) {
        console.error('Silme işlemi başarısız:', error);
      }
    }
  };

   // Pagination logic
   const generatePagination = () => {
    const pages = [];
    const totalPagesToShow = 5; // Show a total of 5 pages at a time

    if (totalPages <= totalPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= totalPagesToShow - 2) {
        for (let i = 1; i <= totalPagesToShow; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - (totalPagesToShow - 2)) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - (totalPagesToShow - 1); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };


  return (
    <div className="user-list-page">
      <h1 className="user-list-title">Kullanıcı Yönetim Paneli</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Kullanıcı Ara..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <table className="user-list-table">
        <thead>
          <tr>
            <th>Adı</th>
            <th>Email</th>
            <th>Rol</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.first_name} {user.last_name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                <button className="action-button details" onClick={() => openModal(user)}>
                  Detaylar
                </button>
                  <button
                    className="action-button delete"
                    onClick={() => handleDelete(user.id)}
                  >
                    Sil
                  </button>
               
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-data">
                Kullanıcı bulunamadı.
              </td>
            </tr>
          )}
        </tbody>
      </table>

       {/* Pagination */}
      <div className="pagination">
        {generatePagination().map((page, index) => (
          <button
            key={index}
            className={`pagination-button ${page === currentPage ? 'active' : ''}`}
            onClick={() => page !== '...' && handlePageChange(page)}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}
      </div>

{/* Kullanıcı Detayları Modalı */}
{isModalOpen && modalUser && (
  <div className="modal-backdrop">
    <div className="modal">
      <h2>Kullanıcı Detayları</h2>
      <p>
        <strong>Adı:</strong> {modalUser.first_name} {modalUser.last_name}
      </p>
      <p>
        <strong>Email:</strong> {modalUser.email}
      </p>
      <p>
        <strong>Rol:</strong> {modalUser.role}
      </p>
      <p>
        <strong>Telefon:</strong> {modalUser.phone_number}
      </p>
      <p>
        <strong>Doğum Tarihi:</strong> {modalUser.birth_date}
      </p>
      <p>
        <strong>Konum:</strong> Latitude: {modalUser.location_latitude}, Longitude: {modalUser.location_longitude}
      </p>
      <button className="modal-close" onClick={closeModal}>
        Kapat
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default UserListPage;

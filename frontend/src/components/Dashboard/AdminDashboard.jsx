import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import './Dashboard.css'; // Using the shared dashboard CSS
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user: adminUser } = useAuth(); // Get the current admin user

  const fetchUsers = useCallback(async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/users');
        setUsers(response.data);
      } catch (err) {
        console.error('Erro ao buscar usuários:', err);
        setError('Falha ao carregar a lista de usuários. Você tem permissão para ver esta página?');
      } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => (u._id === userId ? response.data : u)));
    } catch (err) {
      console.error('Erro ao alterar o papel:', err);
      alert(err.response?.data?.msg || 'Falha ao atualizar o papel do usuário.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        setUsers(users.filter(u => u._id !== userId));
      } catch (err) {
        console.error('Erro ao deletar usuário:', err);
        alert(err.response?.data?.msg || 'Falha ao deletar o usuário.');
      }
    }
  }

  if (loading) return <p>Carregando usuários...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2>Gerenciamento de Usuários</h2>
      <div className="dashboard-list">
        {users.map((user) => (
          <div key={user._id} className="dashboard-item user-management-item">
            <div>
              <strong>{user.name}</strong> ({user.email})
            </div>
            <div className="user-actions">
              <select
                value={user.role}
                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                disabled={user._id === adminUser.id}
              >
                <option value="participante">Participante</option>
                <option value="organizador">Organizador</option>
                <option value="admin">Admin</option>
              </select>
              <button onClick={() => handleDeleteUser(user._id)} disabled={user._id === adminUser.id} className="delete-btn">Deletar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;


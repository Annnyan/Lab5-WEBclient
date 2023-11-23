import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import './UsersPage.scss';

export const UsersPage = ({ token }) => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
      .then(res => res.json())
      .then(result => {
        if (result.users) {
          setUsers(result.users);
        } else {
          navigate('/login');
        }
      });
  }, []);

  const handleDelete = (userId) => {
    fetch(`http://localhost:5000/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
      .then(response => response.json())
      .then(result => {
        if (!result.message) {
          const newUsers = users.filter(user => user._id !== userId);
          setUsers(newUsers);

          if (!newUsers.length) {
            navigate('/login');
          }
        }
      });
  }

  const handleUpdate = (userId) => {
    navigate(`/login?mode=update&userId=${userId}`);
  }

  return (
    <div className="UsersPage">
      <div className="UsersPage__users">
        {users.map(user => (
          <div className="UsersPage__card" key={user._id}>
            <p className="card__username">
              {user.username}
            </p>

            <p className="card__field">
              {`Fullname: ${user.fullname}`}
            </p>

            <p className="card__field">
              {`ID-Card: ${user.idCard}`}
            </p>

            <p className="card__field">
              {`Birth date: ${user.birthDate}`}
            </p>

            <p className="card__field">
              {`City: ${user.city}`}
            </p>

            <p className="card__field">
              {`Email: ${user.email}`}
            </p>

            <button className="button" onClick={() => handleDelete(user._id)}>
              Delete
            </button>

            <button className="button" onClick={() => handleUpdate(user._id)}>
              Update
            </button>
          </div>
        ))}
      </div>


      <button className="button button--logout" onClick={() => navigate('/login')}>
        Logout
      </button>
    </div>
  );
}
import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function SignupComponent() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const redirect = useNavigate()
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3001/signup', formData);
      setMessage(res.data);
      redirect("/")
    } catch (err) {
      setMessage(err.response?.data || 'Error submitting form');
    }
    console.log(formData)
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3001/users');
      setUsers(res.data);
    } catch (err) {
      setMessage('Error fetching users');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-base-100 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Signup Form</h2>

      {message && (
        <div className="alert alert-info mb-4">
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input input-bordered w-full"
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          className="input input-bordered w-full"
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          className="input input-bordered w-full"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          className="input input-bordered w-full"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          className="input input-bordered w-full"
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-primary w-full">
          Sign Up
        </button>
      </form>

      <div className="text-center mt-4">
        <Link to="/" className="link link-primary">Already have an account? Login</Link>
      </div>

      <div className="mt-6">
        <button onClick={fetchUsers} className="btn btn-secondary w-full">
          View Registered Users
        </button>
      </div>

      {users.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Registered Users</h3>
          <ul className="list-disc list-inside">
            {users.map(user => (
              <li key={user.id}>
                {user.first_name} {user.last_name} — {user.email}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SignupComponent;

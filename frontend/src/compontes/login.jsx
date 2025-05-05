import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const redirect = useNavigate()
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await axios.post('http://localhost:3001/login', formData);
      setMessage(`Login successful. Welcome, ${res.data.user.first_name}!`);
      redirect('/dashboard')
    } catch (err) {
      if (err.response?.data?.message) {
        setMessage(`Login failed: ${err.response.data.message}`);
      } else {
        setMessage(`Login failed. Please try again. ${err}`);
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-base-100 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

      {message && (
        <div className={`alert mb-4 ${message.includes('successful') ? 'alert-success' : 'alert-error'}`}>
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
          className="input input-bordered w-full"
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary w-full">
          Login
        </button>
      </form>

      <div className="text-center mt-4">
        <Link to="/signup" className="link link-primary">Create account</Link>
      </div>
    </div>
  );
}

export default Login;

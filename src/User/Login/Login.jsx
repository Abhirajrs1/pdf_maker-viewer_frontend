import React, { useState } from 'react'
import axiosInstance from '../../Services/Interceptors/userInterceptor.js';
import Swal from 'sweetalert2';
import { validateLoginForm } from '../../Services/validation.js';
import { useNavigate } from 'react-router-dom';

function Login() {

  const navigate = useNavigate()
  const[errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validateLoginForm.validate(formData, { abortEarly: false })
      setErrors({})
      const response = await axiosInstance.post('/user-login', formData);
      setErrors({})
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'You have successfully logged in!',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/');
        });
        setFormData({
          email: '',
          password:''
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: response.data.message || 'Invalid email or password!',
          confirmButtonText: 'Try Again'
        });
        setFormData({
          email: '',
          password:''
        })
      }
    } catch (validationErrors) {
      const formattedErrors = {};
      validationErrors.inner.forEach((error) => {
        formattedErrors[error.path] = error.message;
      });
      setErrors(formattedErrors);
      setFormData({
        email: '',
        password:''
      })
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
             {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
             {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Log In
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-700">Don't have an account?</p>
          <button
            className="text-blue-500 hover:underline"
            onClick={() => navigate('/user-signup')}
          >
            Signup here
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login

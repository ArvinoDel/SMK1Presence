import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authAPI } from '@/services/api';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Swal from 'sweetalert2';
import { Navigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
// import { useAuth } from '@/context/AuthContext';


export function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(prevState => !prevState);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password
        })
      });

      const result = await response.json();

      if (result.success) {
        // Gunakan fungsi login dari context untuk menyimpan data
        login(result.data.user, result.data.token);

        // Tampilkan pesan sukses
        Swal.fire({
          icon: 'success',
          title: 'Login Berhasil!',
          text: `Selamat datang, ${result.data.user.nama}!`,
          timer: 3000,
          showConfirmButton: false
        });
        
        // Redirect ke dashboard menggunakan navigate
        navigate('/dashboard/home');
      } else {
        setError(result.message || 'Terjadi kesalahan saat login');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Terjadi kesalahan pada server');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
        timer: 2000,
        showConfirmButton: false,
      });
    }
  }, [error]);


   if (user) {
      return <Navigate to="/dashboard/home" />;
    }
    
  return (
    
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
            Masukkan NIS/NIP dan Password untuk Sign In
          </Typography>
          {/* {error && (
            <Typography variant="small" color="red" className="mt-2">
              {error}
            </Typography>
          )} */}
        </div>
        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              NIS/NIP
            </Typography>
            <Input
              size="lg"
              placeholder="Masukkan NIS/NIP"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              required
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <div className="relative w-full">
              <Input
                type={isVisible ? "text" : "password"}
                size="lg"
                placeholder="********"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="!border-t-blue-gray-200 focus:!border-t-gray-900 pr-10"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              {/* Ikon Mata */}
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-900"
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            className="mt-6"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
    </section>
  );
}

export default SignIn;

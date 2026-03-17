import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Admin Login (Manual)", { email, password });
    navigate('/admin/dashboard');
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log('Google token:', credentialResponse.credential);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential })
      });
      
      if (!res.ok) {
        throw new Error('Authentication failed on server');
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Simulate successful admin routing
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError('Error al autenticar con Google. Intente nuevamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans px-4">
      <div className="max-w-md w-full bg-white p-10 border border-gray-200 shadow-sm">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl tracking-widest uppercase mb-2">Natasha Models</h1>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Panel de Administración</p>
        </div>
        
        {error && <div className="bg-red-50 text-red-500 text-xs p-3 mb-6 text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-black mb-2">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-black transition-colors bg-transparent"
              placeholder="admin@natashamodels.com"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-black mb-2">Contraseña</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-black transition-colors bg-transparent"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-black text-white py-4 mt-8 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
          >
            Ingresar
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center flex-col items-center">
           <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 block text-center">O ingresa con</span>
           <GoogleLogin
             onSuccess={handleGoogleSuccess}
             onError={() => {
               console.log('Login Failed');
               setError('Fallo de conexión con Google.');
             }}
             useOneTap
             shape="pill"
           />
        </div>
      </div>
    </div>
  );
}

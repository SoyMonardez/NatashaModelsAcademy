import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Lock, Mail, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user.role !== 'ADMIN') {
          setError('No tienes permisos de administrador');
          return;
        }
        login(data.user, data.token);
        navigate('/admin');
      } else {
        setError(data.error || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-bold tracking-tighter uppercase mb-2">NATASHA</h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]">Panel de Control</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-xs font-bold p-4 mb-6 rounded-lg text-center uppercase tracking-wider border border-red-100 italic">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                placeholder="admin@natasha.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-5 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : 'Ingresar al sistema'}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <button 
            onClick={() => navigate('/')}
            className="w-full text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
          >
            ← Volver al sitio principal
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileCheck, 
  TrendingUp, 
  Calendar,
  ToggleLeft as Toggle,
  ToggleRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { useAuthStore } from '../../store/authStore';
import { useNotification } from '../../store/useNotification';

// Mock/Default data for the dashboard if API fails or is empty
const defaultStats = {
  userCount: 0,
  inscriptionCount: 0,
  ageStats: { "15-19": 5, "20-24": 12, "25-29": 8, "30+": 3 },
  genderStats: { Femenino: 20, Masculino: 5, Otro: 3 },
  locationStats: { "Capital": 10, "Rawson": 5, "Chimbas": 3, "Rivadavia": 7, "Santa Lucía": 4 }
};

const COLORS = ['#000000', '#4B5563', '#9CA3AF', '#D1D5DB', '#E5E7EB'];

export default function Dashboard() {
  const [stats, setStats] = useState(defaultStats);
  const [isInscriptionOpen, setIsInscriptionOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, settingsRes] = await Promise.all([
          fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/settings', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data);
        }

        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          const openSetting = settings.find(s => s.key === 'isInscriptionOpen');
          if (openSetting) setIsInscriptionOpen(openSetting.value === 'true');
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        setLoading(false);
      }
    };
    if (token) fetchStats();
    else setLoading(false);
  }, [token]);

  const ageData = stats.ageStats ? Object.entries(stats.ageStats).map(([name, value]) => ({ name, value })) : [];
  const genderData = stats.genderStats ? Object.entries(stats.genderStats).map(([name, value]) => ({ name, value })) : [];
  const locationData = stats.locationStats ? Object.entries(stats.locationStats).map(([name, value]) => ({ name, value })) : [];

  const toggleInscriptions = async () => {
    try {
      const newValue = !isInscriptionOpen;
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ key: 'isInscriptionOpen', value: String(newValue) })
      });
      if (response.ok) {
        setIsInscriptionOpen(newValue);
        showNotification(newValue ? 'Inscripciones abiertas' : 'Inscripciones cerradas', 'info');
      }
    } catch (error) {
      console.error("Failed to toggle inscriptions", error);
    }
  };

  const statCards = [
    { title: 'Usuarios Registrados', value: stats.userCount, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { title: 'Inscripciones Totales', value: stats.inscriptionCount, icon: FileCheck, color: 'bg-green-50 text-green-600' },
    { title: 'Tasa de Conversión', value: '14%', icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
    { title: 'Próximo Inicio', value: '15 Abr', icon: Calendar, color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"
          >
            <div className={`p-3 rounded-lg ${card.color}`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{card.title}</p>
              <p className="text-2xl font-serif font-bold mt-1 text-black">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Age Distribution Chart */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-8 flex items-center justify-between">
            Distribución por Edades
            <span className="text-[10px] font-normal text-gray-400">Total inscripciones</span>
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" aspect={2} debounce={100}>
              <BarChart data={ageData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#000000" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender distribution */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
           <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-8">
            Distribución por Sexo
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" aspect={2} debounce={100}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Control Panel Section */}
      <div className="bg-black text-white p-8 rounded-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-serif font-bold uppercase tracking-tighter mb-2">Control de Inscripciones</h3>
          <p className="text-gray-400 text-xs uppercase tracking-widest">Activa o desactiva la posibilidad de que nuevos alumnos se inscriban en la academia.</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-widest">Estado Actual</p>
            <p className={`text-sm font-bold uppercase tracking-widest mt-1 ${isInscriptionOpen ? 'text-green-400' : 'text-red-400'}`}>
              {isInscriptionOpen ? 'Abiertas' : 'Cerradas'}
            </p>
          </div>
          <button 
            onClick={toggleInscriptions}
            className="transition-transform active:scale-90"
          >
            {isInscriptionOpen ? (
              <ToggleRight size={64} className="text-green-400" />
            ) : (
              <Toggle size={64} className="text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Location Bar Chart */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-8">
          Geolocalización (Departamentos de San Juan)
        </h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={locationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis type="number" axisLine={false} tickLine={false} hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#000', fontWeight: 'bold' }} width={100} />
              <Tooltip cursor={{ fill: '#f9fafb' }} />
              <Bar dataKey="value" fill="#1f2937" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

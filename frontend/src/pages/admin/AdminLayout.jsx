import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserSquare2, 
  Newspaper, 
  FileEdit, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  PlayCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { googleLogout } from '@react-oauth/google';

const sidebarLinks = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { name: 'Modelos', icon: UserSquare2, path: '/admin/models' },
  { name: 'Noticias', icon: Newspaper, path: '/admin/news' },
  { name: 'Cursos', icon: PlayCircle, path: '/admin/courses' },
  { name: 'Inscripciones', icon: FileEdit, path: '/admin/inscriptions' },
  { name: 'Consultas', icon: MessageSquare, path: '/admin/contacts' },
  { name: 'Ajustes', icon: Settings, path: '/admin/settings' },
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    googleLogout();
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans">
      {/* Sidebar */}
      <aside className={`bg-black text-white transition-all duration-300 fixed md:relative z-40 h-screen flex flex-col ${isSidebarOpen ? 'w-72' : 'w-24'}`}>
        <div className="p-8 flex items-center justify-between mb-4">
          <Link to="/" className={`font-serif font-bold tracking-[0.2em] transition-opacity hover:opacity-80 ${isSidebarOpen ? 'text-2xl' : 'text-xs text-center'}`}>
            NATASHA<br/><span className="text-[10px] font-sans tracking-[0.4em] text-gray-400">ADMIN</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden md:block text-gray-500 hover:text-white transition-colors">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-white text-black shadow-lg shadow-white/5' 
                    : 'text-gray-500 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={22} className={`flex-shrink-0 ${isActive ? 'text-black' : 'group-hover:scale-110 transition-transform'}`} />
                {isSidebarOpen && (
                  <span className={`text-[11px] font-bold uppercase tracking-[0.2em] whitespace-nowrap`}>
                    {link.name}
                  </span>
                )}
                {isActive && isSidebarOpen && <div className="ml-auto w-1.5 h-1.5 bg-black rounded-full" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-white/5 space-y-1">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-5 py-4 text-gray-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all w-full group"
          >
            <LogOut size={20} className="flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 h-24 flex items-center justify-between px-10 flex-shrink-0 sticky top-0 z-30">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-1">Panel de Gestión</p>
            <h2 className="text-lg font-serif font-bold tracking-tight text-black capitalize">
              {sidebarLinks.find(l => l.path === pathname)?.name || 'Dashboard Overview'}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="text-xs font-bold uppercase tracking-widest text-black">{user?.name || 'Super Admin'}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-medium">Acceso Total</p>
            </div>
            <div className="relative group">
              <img 
                src={user?.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop'} 
                className="w-12 h-12 rounded-2xl border-2 border-gray-50 object-cover shadow-sm group-hover:shadow-md transition-shadow cursor-pointer" 
                alt="Admin" 
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-10 bg-[#F8F9FA]/50 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile Menu Toggle (Overlay Only) */}
      <div className="md:hidden">
         {!isSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="fixed bottom-8 right-8 bg-black text-white p-5 rounded-3xl shadow-2xl z-50 hover:scale-110 active:scale-95 transition-all"
            >
              <Menu size={24} />
            </button>
         )}
      </div>
    </div>
  );
}

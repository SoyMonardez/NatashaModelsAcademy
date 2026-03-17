import { useState, useEffect } from 'react';
import { Youtube, Save, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function CourseManager() {
  const { token } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses'); // Assuming this public endpoint exists
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleUpdateUrl = async (id, newUrl) => {
    setSaving(id);
    try {
      // Assuming a PUT /api/admin/courses/:id exists or similar
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ youtubeUrl: newUrl })
      });
      
      if (res.ok) {
        setCourses(courses.map(c => c.id === id ? { ...c, youtubeUrl: newUrl } : c));
      }
    } catch (err) {
      console.error(err);
    }
    setSaving(null);
  };

  if (loading) return <div className="p-20 text-center uppercase tracking_widest text-xs font-bold">Cargando Cursos...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-serif font-bold uppercase tracking-tighter mb-8 pb-4 border-b border-gray-100">Gestión de Contenido (YouTube)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="border border-gray-100 p-6 rounded-lg bg-gray-50/50">
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${course.type === 'FREE' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                  {course.type}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{course.category}</span>
              </div>
              
              <h4 className="font-bold text-lg mb-4">{course.title}</h4>
              
              <div className="relative group">
                <Youtube size={16} className="absolute left-3 top-3.5 text-red-600" />
                <input 
                  type="text" 
                  defaultValue={course.youtubeUrl}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded text-sm focus:border-black outline-none transition-colors"
                  placeholder="ID de video o URL de YouTube"
                  onBlur={(e) => {
                    if (e.target.value !== course.youtubeUrl) {
                      handleUpdateUrl(course.id, e.target.value);
                    }
                  }}
                />
                <div className="absolute right-3 top-3.5">
                  {saving === course.id ? <Loader2 size={16} className="animate-spin text-gray-400" /> : <Save size={16} className="text-gray-300 group-focus-within:text-black" />}
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest italic">El cambio se guarda al perder el foco del campo.</p>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-20">
             <p className="text-gray-400 text-xs uppercase tracking-widest">No hay cursos disponibles para gestionar.</p>
          </div>
        )}
      </div>
    </div>
  );
}

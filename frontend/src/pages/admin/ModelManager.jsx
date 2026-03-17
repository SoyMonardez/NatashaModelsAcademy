import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Loader2, Upload } from 'lucide-react';
import { useNotification } from '../../store/useNotification';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function ModelManager() {
  const { showNotification } = useNotification();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    sex: 'FEMENINO',
    category: 'ALTA COSTURA',
    bust: '',
    waist: '',
    hips: '',
    existingImages: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });

  const categories = ['ALTA COSTURA', 'COMERCIAL', 'EDITORIAL', 'CURVY / PLUS SIZE', 'FITNESS'];

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const res = await fetch('/api/models');
      const data = await res.json();
      setModels(data);
    } catch (err) {
      console.error('Error fetching models:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const method = editingModel ? 'PUT' : 'POST';
    const url = editingModel ? `/api/models/${editingModel.id}` : '/api/models';

    const data = new FormData();
    // Sanitize numeric fields: remove spaces and replace commas
    const sanitizeNum = (val) => String(val || '').replace(/\s/g, '').replace(',', '.');
    
    data.append('name', formData.name);
    data.append('age', sanitizeNum(formData.age));
    data.append('height', sanitizeNum(formData.height));
    data.append('sex', formData.sex);
    data.append('category', formData.category);
    data.append('bust', formData.bust);
    data.append('waist', formData.waist);
    data.append('hips', formData.hips);
    
    // Add existing images if editing
    formData.existingImages.forEach(imgUrl => {
      data.append('existingImages', imgUrl);
    });

    // Add new files
    selectedFiles.forEach(file => {
      data.append('images', file);
    });

    try {
      const res = await fetch(url, {
        method,
        body: data, // No Content-Type header needed, browser sets it for FormData
      });

      if (res.ok) {
        showNotification(editingModel ? 'Modelo actualizado con éxito' : 'Modelo creado con éxito', 'success');
        fetchModels();
        closeModal();
      } else {
        const text = await res.text();
        console.error('Raw error response:', text);
        try {
          const errData = JSON.parse(text);
          showNotification(errData.error || 'Error del servidor', 'error');
        } catch (e) {
          showNotification('Error crítico del servidor (500)', 'error');
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
      showNotification('Error de conexión con el servidor', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/models/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotification('Modelo eliminado con éxito', 'success');
        fetchModels();
      } else {
        showNotification('Error al eliminar el modelo', 'error');
      }
    } catch (err) {
      console.error('Error deleting model:', err);
      showNotification('Error de conexión al eliminar', 'error');
    }
  };

  const openModal = (model = null) => {
    if (model) {
      setEditingModel(model);
      // Parse measurements string "B: X | W: Y | H: Z"
      const mMatch = model.measurements?.match(/B:\s*(.*?)\s*\|\s*[CW]:\s*(.*?)\s*\|\s*[CH]:\s*(.*)/);
      setFormData({
        name: model.name,
        age: model.age,
        height: model.height,
        sex: model.sex,
        category: model.category,
        bust: mMatch ? mMatch[1] : '',
        waist: mMatch ? mMatch[2] : '',
        hips: mMatch ? mMatch[3] : '',
        existingImages: model.images.map(img => img.url)
      });
    } else {
      setEditingModel(null);
      setFormData({
        name: '',
        age: '',
        height: '',
        sex: 'FEMENINO',
        category: 'ALTA COSTURA',
        bust: '',
        waist: '',
        hips: '',
        existingImages: []
      });
    }
    setSelectedFiles([]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingModel(null);
    setSelectedFiles([]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setFormData({
      ...formData,
      existingImages: formData.existingImages.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h3 className="text-2xl font-serif font-bold tracking-tight">Administrar Modelos</h3>
          <p className="text-gray-400 text-xs uppercase tracking-widest mt-1">Gestión del staff de talentos</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-black text-white px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-900 transition-all flex items-center gap-2 shadow-lg shadow-black/10"
        >
          <Plus size={16} /> Agregar Modelo
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin text-gray-300" size={40} />
        </div>
      ) : models.length === 0 ? (
        <div className="bg-white p-20 rounded-2xl border border-dashed border-gray-200 text-center">
          <p className="text-gray-400 text-xs uppercase tracking-[0.2em]">No hay modelos cargados en el sistema.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <div key={model.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group transition-all hover:shadow-xl hover:shadow-black/5">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img 
                   src={model.images[0]?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'} 
                  alt={model.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6 gap-3">
                  <button onClick={() => openModal(model)} className="flex-1 bg-white text-black py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                    <Edit2 size={14} /> Editar
                  </button>
                  <button onClick={() => setDeleteConfirm({ isOpen: true, id: model.id })} className="flex-1 bg-red-500 text-white py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                    <Trash2 size={14} /> Eliminar
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-serif font-bold text-black">{model.name}</h4>
                  <span className="bg-gray-100 text-[9px] font-bold px-2 py-1 rounded text-gray-500 uppercase tracking-widest">
                    {model.category}
                  </span>
                </div>
                <div className="flex gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  <span>{model.age} Años</span>
                  <span>{model.height}m</span>
                  <span>{model.sex}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal / Sidebar for adding/editing */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-2xl bg-white h-screen overflow-y-auto p-10 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
              <h3 className="text-2xl font-serif font-bold">{editingModel ? 'Editar Modelo' : 'Nuevo Modelo'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-black transition-colors"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 pb-10">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Nombre Completo</label>
                  <input 
                    type="text" 
                    id="model_name"
                    name="name"
                    required 
                    className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Categoría</label>
                  <select 
                    id="model_category"
                    name="category"
                    className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-black outline-none transition-all cursor-pointer"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Edad</label>
                  <input 
                    type="number" 
                    id="model_age"
                    name="age"
                    required 
                    className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Altura (m)</label>
                  <input 
                    type="number" 
                    id="model_height"
                    name="height"
                    step="0.01" 
                    required 
                    className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Género</label>
                  <select 
                    id="model_sex"
                    name="sex"
                    className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-black outline-none transition-all cursor-pointer"
                    value={formData.sex}
                    onChange={(e) => setFormData({...formData, sex: e.target.value})}
                  >
                    <option value="FEMENINO">FEMENINO</option>
                    <option value="MASCULINO">MASCULINO</option>
                    <option value="OTRO">OTRO</option>
                  </select>
                </div>
              </div>

              {/* Medidas Mejoradas */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">Medidas del Cuerpo</label>
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-300">Busto</label>
                    <input 
                      type="text" 
                      id="model_bust"
                      name="bust"
                      placeholder="Ej: 90"
                      className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                      value={formData.bust}
                      onChange={(e) => setFormData({...formData, bust: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-300">Cintura</label>
                    <input 
                      type="text" 
                      id="model_waist"
                      name="waist"
                      placeholder="Ej: 60"
                      className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                      value={formData.waist}
                      onChange={(e) => setFormData({...formData, waist: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-300">Cadera</label>
                    <input 
                      type="text" 
                      id="model_hips"
                      name="hips"
                      placeholder="Ej: 90"
                      className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                      value={formData.hips}
                      onChange={(e) => setFormData({...formData, hips: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Upload de Imágenes Mejorado */}
              <div className="space-y-6">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">Imágenes del Modelo</label>
                
                {/* Existing Images */}
                {formData.existingImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {formData.existingImages.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                        <img src={url} className="w-full h-full object-cover" alt="Existente" />
                        <button 
                          type="button"
                          onClick={() => removeExistingImage(idx)}
                          className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* New Files to Upload */}
                <div className="grid grid-cols-4 gap-4">
                  {selectedFiles.map((fileObj, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-black/5">
                      <img 
                         src={URL.createObjectURL(fileObj)} 
                        className="w-full h-full object-cover" 
                        alt="Vista previa" 
                      />
                      <button 
                        type="button"
                        onClick={() => removeSelectedFile(idx)}
                        className="absolute top-1 right-1 bg-black text-white p-1 rounded-full hover:bg-red-500 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  
                  <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-black hover:bg-gray-50 transition-all flex flex-col items-center justify-center cursor-pointer group">
                    <Upload size={24} className="text-gray-300 group-hover:text-black transition-colors" />
                    <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-black mt-2">Subir Foto</span>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-black text-white py-6 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all shadow-2xl shadow-black/20 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-900'}`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={16} /> GUARDANDO...
                  </div>
                ) : (
                  editingModel ? 'Guardar Cambios' : 'Crear Modelo'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Modal - Confirm Delete */}
      <ConfirmModal 
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null })}
        onConfirm={() => handleDelete(deleteConfirm.id)}
        title="¿Eliminar Modelo?"
        message="Esta acción no se puede deshacer. Se borrarán todos los datos y fotos del modelo."
      />
    </div>
  );
}

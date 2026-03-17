import { useState, useEffect } from 'react';
import { Loader2, Trash2, Eye, CheckCircle, Clock, MessageSquare, Mail } from 'lucide-react';
import { useNotification } from '../../store/useNotification';

export default function ModelRequestManager() {
  const { showNotification } = useNotification();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/submissions?type=MODEL_REQUEST');
      const data = await res.json();
      
      // Parse JSON data from string
      const parsedData = data.map(req => ({
        ...req,
        parsedData: JSON.parse(req.data)
      }));
      
      setRequests(parsedData);
    } catch (err) {
      console.error('Error fetching model requests:', err);
      showNotification('Error al cargar solicitudes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/submissions/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        showNotification('Estado actualizado', 'success');
        fetchRequests();
        if (selectedRequest?.id === id) {
          setSelectedRequest(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      showNotification('Error al actualizar estado', 'error');
    }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta solicitud?')) return;
    
    try {
      const res = await fetch(`/api/submissions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotification('Solicitud eliminada', 'success');
        fetchRequests();
        if (selectedRequest?.id === id) setSelectedRequest(null);
      }
    } catch (err) {
      showNotification('Error al eliminar', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-100 text-amber-700';
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-2xl font-serif font-bold tracking-tight">Solicitudes de Modelos</h3>
        <p className="text-gray-400 text-xs uppercase tracking-widest mt-1">Gestión de castings y bookings</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* List of Requests */}
        <div className={`w-full ${selectedRequest ? 'lg:w-1/2' : ''} transition-all duration-300`}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-gray-200" size={40} /></div>
            ) : requests.length === 0 ? (
              <div className="p-20 text-center text-gray-400 text-xs uppercase tracking-widest">No hay solicitudes pendientes</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-4">Cliente / Marca</th>
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4">Modelos</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Ver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {requests.map((req) => (
                    <tr 
                      key={req.id} 
                      onClick={() => setSelectedRequest(req)}
                      className={`cursor-pointer transition-colors ${selectedRequest?.id === req.id ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-sm truncate max-w-[150px]">{req.parsedData.name}</div>
                        <div className={`text-[10px] uppercase font-bold tracking-tighter ${selectedRequest?.id === req.id ? 'text-gray-400' : 'text-gray-400'}`}>
                          {req.parsedData.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${selectedRequest?.id === req.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                          {req.parsedData.models?.length || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[8px] font-bold px-2 py-1 rounded uppercase tracking-widest ${selectedRequest?.id === req.id ? 'bg-white/20 text-white border border-white/20' : getStatusColor(req.status)}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Eye size={16} className={selectedRequest?.id === req.id ? 'text-white' : 'text-gray-300'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Request Details Sidebar/Panel */}
        {selectedRequest && (
          <div className="w-full lg:w-1/2 animate-in slide-in-from-right duration-300">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-8 border-b border-gray-100 flex justify-between items-start">
                <div>
                  <h4 className="text-2xl font-serif font-bold uppercase tracking-tight mb-2">{selectedRequest.parsedData.subject || 'Sin Asunto'}</h4>
                  <div className="flex gap-4">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded uppercase tracking-widest ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <Clock size={12} /> {new Date(selectedRequest.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="text-gray-300 hover:text-black transition-colors">
                  <Eye size={24} className="rotate-180" />
                </button>
              </div>

              <div className="p-8 space-y-10">
                {/* Client Info */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Marca / Contacto</label>
                    <p className="text-lg font-bold">{selectedRequest.parsedData.name}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Teléfono / Email</label>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium">{selectedRequest.parsedData.phone}</p>
                      <a 
                        href={`https://wa.me/${selectedRequest.parsedData.phone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(selectedRequest.parsedData.name)}%2C%20le%20escribimos%20desde%20Natasha%20Models%20Academy%20por%20su%20solicitud%20de%20modelos.`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-700 hover:text-white transition-all flex items-center justify-center"
                        title="Enviar WhatsApp"
                      >
                        <MessageSquare size={14} />
                      </a>
                    </div>
                    {selectedRequest.parsedData.email && (
                      <div className="flex items-center gap-3 mt-2">
                         <p className="text-sm text-gray-500 truncate max-w-[150px]">{selectedRequest.parsedData.email}</p>
                         <a 
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedRequest.parsedData.email}&su=Respuesta a solicitud de modelos - Natasha Models Academy&body=Hola%20${encodeURIComponent(selectedRequest.parsedData.name)}%2C%0D%0A%0D%0AUn%20gusto%20saludarle.%20Hemos%20recibido%20su%20solicitud%20de%20modelos%20en%20Natasha%20Models%20Academy...`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-700 hover:text-white transition-all flex items-center justify-center"
                          title="Enviar Gmail"
                        >
                          <Mail size={14} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Descripción del Proyecto</label>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100 italic">
                    "{selectedRequest.parsedData.description}"
                  </p>
                </div>

                {/* Requested Models */}
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Modelos Solicitados ({selectedRequest.parsedData.models?.length || 0})</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedRequest.parsedData.models?.map(m => (
                      <div key={m.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        {m.image ? (
                          <img src={m.image} alt={m.name} className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-[10px] font-bold uppercase tracking-tighter text-gray-400">
                             MOD
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest">{m.name}</p>
                          <p className="text-[8px] text-gray-400 uppercase tracking-[0.2em]">{m.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Controls */}
                <div className="pt-8 border-t border-gray-100 flex flex-wrap gap-4">
                  {selectedRequest.status !== 'COMPLETED' && (
                    <button 
                      onClick={() => updateStatus(selectedRequest.id, 'COMPLETED')}
                      className="bg-black text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-green-600 transition-all flex items-center gap-2"
                    >
                      <CheckCircle size={14} /> Marcar como Finalizado
                    </button>
                  )}
                  {selectedRequest.status !== 'PENDING' && (
                    <button 
                      onClick={() => updateStatus(selectedRequest.id, 'PENDING')}
                      className="bg-amber-100 text-amber-700 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-amber-200 transition-all"
                    >
                      Mover a Pendiente
                    </button>
                  )}
                  <button 
                    onClick={() => deleteRequest(selectedRequest.id)}
                    className="bg-red-50 text-red-500 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                  >
                    <Trash2 size={14} /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

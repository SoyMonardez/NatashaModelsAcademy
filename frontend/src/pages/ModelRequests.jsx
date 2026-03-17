import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ModelRequests() {
  const cart = useStore(state => state.modelCart);
  const removeFromCart = useStore(state => state.removeFromCart);
  const clearCart = useStore(state => state.clearCart);
  const fetchCart = useStore(state => state.fetchCart);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    description: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [submittedModels, setSubmittedModels] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Capture model names for WhatsApp before clearing cart
    const modelNames = cart.map(m => m.name);
    setSubmittedModels(modelNames);

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'MODEL_REQUEST',
          data: {
            ...formData,
            models: cart.map(m => ({ 
              id: m.id, 
              name: m.name, 
              category: m.category,
              image: m.images?.[0]?.url || m.image
            }))
          }
        })
      });

      if (res.ok) {
        setSubmitted(true);
        await clearCart();
      } else {
        alert('Error al enviar la solicitud. Por favor intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Error de conexión.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (submitted) {
    const waMessage = `Hola Natasha Models Academy, acabo de enviar una solicitud web para los siguientes modelos: ${submittedModels.join(', ')}. Mi nombre es ${formData.name} y el proyecto es: ${formData.subject}.`;
    const waUrl = `https://wa.me/5492646296764?text=${encodeURIComponent(waMessage)}`;

    return (
      <div className="max-w-3xl mx-auto px-4 py-32 mt-10 text-center">
        <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8">
          <Check className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-serif mb-4 uppercase tracking-widest">Solicitud Enviada</h1>
        <p className="text-gray-500 font-sans mb-8">
          Hemos recibido tu solicitud. Para agilizar el proceso, puedes enviarnos un WhatsApp ahora mismo con los detalles.
        </p>

        <div className="flex flex-col items-center gap-6">
          <a 
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-[#128C7E] transition-all shadow-xl shadow-green-500/20"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            Confirmar vía WhatsApp
          </a>

          <Link to="/models" className="text-gray-400 font-bold uppercase tracking-widest text-[10px] hover:text-black transition-colors">
            Volver a la galería
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mt-10">
      <h1 className="text-4xl md:text-5xl font-serif font-bold uppercase tracking-tight mb-12 border-b border-gray-200 pb-6">
        Model Requests
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 font-sans mb-8">No has seleccionado ningún modelo aún.</p>
          <Link to="/models" className="bg-black text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-gray-800 transition-colors">
            Explorar Modelos
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Selected Models List */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-8">
              Modelos Seleccionados ({cart.length})
            </h2>
            <div className="space-y-6">
              {cart.map(model => (
                <div key={model.id} className="flex items-center gap-6 p-4 bg-gray-50 border border-gray-100">
                  <img 
                    src={model.image || model.images?.[0]?.url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100'} 
                    alt={model.name} 
                    className="w-20 h-24 object-cover grayscale" 
                  />
                  <div className="flex-grow">
                    <h3 className="font-serif text-xl uppercase tracking-wide">{model.name}</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{model.category}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(model.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Request Form */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-8">
              Detalles de la Solicitud
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-black mb-2">Nombre de Marca / Persona *</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent"
                />
              </div>
              
              <div className="flex gap-8">
                <div className="w-1/2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-black mb-2">Celular *</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-black mb-2">Email (Opcional)</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-black mb-2">Asunto *</label>
                <input 
                  type="text" 
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-black mb-2">Descripción del Trabajo/Proyecto *</label>
                <textarea 
                  name="description"
                  required
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
              >
                Enviar Solicitud
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
}

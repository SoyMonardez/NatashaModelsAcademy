import { useState } from 'react';
import { useStore } from '../store/useStore';
import { X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ModelRequests() {
  const cart = useStore(state => state.modelCart);
  const removeFromCart = useStore(state => state.removeFromCart);
  const clearCart = useStore(state => state.clearCart);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    description: ''
  });
  
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here we would normally send to the backend API
    console.log("Submitting request", { formData, models: cart });
    
    // Simulate API success
    setTimeout(() => {
      setSubmitted(true);
      clearCart();
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 mt-10 text-center">
        <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8">
          <Check className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-serif mb-4 uppercase tracking-widest">Solicitud Enviada</h1>
        <p className="text-gray-500 font-sans mb-12">
          Hemos recibido tu solicitud. Nuestro equipo se pondrá en contacto a la brevedad para confirmar disponibilidad y presupuesto.
        </p>
        <Link to="/models" className="border-b-2 border-black pb-1 uppercase tracking-widest text-xs font-bold hover:text-gray-500 hover:border-gray-500 transition-colors">
          Volver a Modelos
        </Link>
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
                  <img src={model.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100'} alt={model.name} className="w-20 h-24 object-cover grayscale" />
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

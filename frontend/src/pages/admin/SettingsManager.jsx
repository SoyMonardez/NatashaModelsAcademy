export default function SettingsManager() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-serif font-bold uppercase tracking-tighter mb-8 pb-4 border-b border-gray-100 text-center md:text-left">Ajustes del Sistema</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Google Client ID</label>
            <input type="text" className="w-full border border-gray-200 p-3 bg-gray-50 text-xs text-gray-500 rounded" value="***-***.apps.googleusercontent.com" readOnly />
          </div>
          
          <div className="pt-4">
             <button className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-[0.2em] shadow-lg">Guardar Configuración</button>
          </div>
        </div>
      </div>
    </div>
  );
}

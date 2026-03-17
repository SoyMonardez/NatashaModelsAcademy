export default function InscriptionManager() {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
      <div className="mb-8 pb-4 border-b border-gray-100 text-center md:text-left">
        <h3 className="text-xl font-serif font-bold uppercase tracking-tighter">Listado de Inscripciones</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100">
              <th className="py-4">Nombre</th>
              <th className="py-4">Edad</th>
              <th className="py-4">Origen</th>
              <th className="py-4">Estado</th>
              <th className="py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="py-20 text-center text-gray-400 text-xs uppercase tracking-widest">Cargando inscripciones...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function NewsManager() {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
        <h3 className="text-xl font-serif font-bold uppercase tracking-tighter">Administrar Noticias</h3>
        <button className="bg-black text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
          + Nueva Noticia
        </button>
      </div>
      <p className="text-gray-400 text-xs uppercase tracking-[0.2em] text-center mt-20">No hay noticias publicadas.</p>
    </div>
  );
}

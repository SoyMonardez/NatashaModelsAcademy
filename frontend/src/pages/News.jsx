import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Search, Filter } from 'lucide-react';

export default function News() {
  const { t } = useTranslation();
  const CATEGORIES = t('news.categories', { returnObjects: true }) || [];
  const DUMMY_NEWS = t('news.data', { returnObjects: true }) || [];
  const [activeCatIndex, setActiveCatIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter based on search query and category
  const filteredNews = useMemo(() => {
    return DUMMY_NEWS.filter(news => {
      const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            news.extract.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCatIndex === 0 || news.category.toUpperCase() === CATEGORIES[activeCatIndex].toUpperCase();
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCatIndex, DUMMY_NEWS, CATEGORIES]);

  // Separate featured news (first one)
  const featuredNews = filteredNews.length > 0 ? filteredNews[0] : null;
  const standardNews = filteredNews.length > 1 ? filteredNews.slice(1) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mt-10">
      <div className="text-center mb-16 border-b border-gray-200 pb-16">
        <h1 className="text-5xl md:text-7xl font-serif font-bold uppercase tracking-tighter mb-6">{t('nav.news')}</h1>
        <p className="text-gray-500 max-w-2xl mx-auto font-sans">
          {t('news.desc')}
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-16 mx-auto max-w-4xl">
         
         <div className="relative w-full md:w-1/2">
           <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
           </div>
           <input 
             type="text" 
             placeholder={t('news.search_placeholder')}
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full pl-12 pr-4 py-4 border-b border-gray-200 bg-transparent text-xs font-bold uppercase tracking-widest text-black focus:outline-none focus:border-black transition-colors"
           />
         </div>

         <div className="flex overflow-x-auto w-full md:w-1/2 gap-6 pb-4 md:pb-0 hide-scrollbar snap-x snap-mandatory">
          {CATEGORIES.map((cat, idx) => (
            <button 
              key={idx} 
              onClick={() => setActiveCatIndex(idx)} 
              className={`flex-none snap-center text-xs font-bold uppercase tracking-widest py-3 px-2 md:py-0 md:px-0 md:pb-1 transition-colors whitespace-nowrap ${
                activeCatIndex === idx 
                  ? 'text-black border-b-2 border-black' 
                  : 'text-gray-400 hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
         </div>

      </div>

      {/* Featured News */}
      {featuredNews && (
        <div className="mb-20 group cursor-pointer block">
          <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden bg-gray-200 mb-8">
            <img 
              src={featuredNews.image} 
              alt={featuredNews.title} 
              className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
            />
            <div className="absolute top-6 left-6">
              <span className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest">
                {featuredNews.category}
              </span>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center px-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">{featuredNews.date}</p>
            <h2 className="text-4xl md:text-5xl font-serif uppercase tracking-tight mb-6 group-hover:text-gray-600 transition-colors">
              {featuredNews.title}
            </h2>
            <p className="text-gray-600 font-sans text-lg mb-8 max-w-2xl mx-auto">
              {featuredNews.extract}
            </p>
            <button className="inline-flex items-center text-xs font-bold uppercase tracking-widest border-b-2 border-black py-2 md:py-0 md:pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
              {t('news.read_full')} <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Standard News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
        {standardNews.map(news => (
          <article key={news.id} className="group cursor-pointer border-t border-gray-200 pt-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{news.category}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{news.date}</span>
            </div>
            
            <div className="relative h-64 w-full overflow-hidden bg-gray-100 mb-6">
              <img 
                src={news.image} 
                alt={news.title} 
                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
              />
            </div>
            
            <h3 className="text-2xl font-serif uppercase tracking-wide mb-4 group-hover:text-gray-600 transition-colors">
              {news.title}
            </h3>
            
            <p className="text-gray-500 font-sans mb-6">
              {news.extract}
            </p>
            
            <button className="text-xs font-bold uppercase tracking-widest py-2 hover:text-gray-500 transition-colors">
               {t('news.read_more')}
            </button>
          </article>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-20 text-gray-400 font-sans">
          {t('news.no_news')}
        </div>
      )}
    </div>
  );
}

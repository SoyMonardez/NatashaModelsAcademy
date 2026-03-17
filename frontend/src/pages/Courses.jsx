import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Lock, Unlock, User, BookOpen, Search, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';


const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] } }
};

export default function Courses() {
  const { t } = useTranslation();
  const COURSES_DATA = t('courses.data', { returnObjects: true }) || [];
  const [activeTier, setActiveTier] = useState('free'); // 'free' or 'premium'
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' or 'teachers'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const allCategories = COURSES_DATA.map(c => c.category);
    return ['All', ...new Set(allCategories)];
  }, []);

  // Filter based on tier, search query, and category
  const filteredCourses = useMemo(() => {
    return COURSES_DATA.filter(course => {
      const matchesTier = course.tier === activeTier;
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      
      return matchesTier && matchesSearch && matchesCategory;
    });
  }, [activeTier, searchQuery, selectedCategory, COURSES_DATA]);

  // Grouping
  const groupedByCategory = filteredCourses.reduce((acc, course) => {
    if (!acc[course.category]) acc[course.category] = [];
    acc[course.category].push(course);
    return acc;
  }, {});

  const groupedByTeacher = filteredCourses.reduce((acc, course) => {
    if (!acc[course.teacher]) acc[course.teacher] = [];
    acc[course.teacher].push(course);
    return acc;
  }, {});

  const currentGroups = activeTab === 'catalog' ? groupedByCategory : groupedByTeacher;

  return (
    <div className="w-full min-h-screen bg-brand-white pt-24 md:pt-32 pb-20">
      
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-16 md:mb-24">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="border-b border-black pb-12"
        >
          <motion.span variants={fadeInUp} className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold text-gray-500 mb-4 block">
            {t('courses.subtitle')}
          </motion.span>
          <motion.h1 variants={fadeInUp} className="text-6xl md:text-9xl font-sans font-bold uppercase tracking-tighter leading-none mb-8" dangerouslySetInnerHTML={{__html: t('courses.title').replace(' ', '<br/>')}}></motion.h1>
          <motion.p variants={fadeInUp} className="text-gray-500 font-sans text-lg md:text-xl max-w-2xl">
            {t('courses.desc')}
          </motion.p>
        </motion.div>
      </section>

      {/* Filters and Controls */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-16 relative z-10 flex flex-col gap-6">
        
        {/* Search & Category Row */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
           <div className="relative w-full md:w-2/3">
             <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
             </div>
             <input 
               type="text" 
               placeholder={t('courses.search_placeholder')}
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-12 pr-4 py-4 border border-gray-200 bg-white text-xs font-bold uppercase tracking-widest text-black focus:outline-none focus:border-black transition-colors"
             />
           </div>
           
           <div className="relative w-full md:w-1/3">
             <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Filter className="w-5 h-5 text-gray-400" />
             </div>
             <select 
               value={selectedCategory}
               onChange={(e) => setSelectedCategory(e.target.value)}
               className="w-full pl-12 pr-10 py-4 border border-gray-200 bg-white text-xs font-bold uppercase tracking-widest text-black focus:outline-none focus:border-black transition-colors appearance-none cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap"
             >
                {categories.map((cat) => (
                   <option key={cat} value={cat}>
                    {cat === 'All' ? t('courses.all_categories') : cat.toUpperCase()}
                  </option>
                ))}
             </select>
           </div>
        </div>

        {/* Tier & Tab Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border border-gray-200 p-2 bg-white shadow-sm">
          
          {/* Tier Switcher (Free/Premium) */}
          <div className="flex w-full md:w-auto relative">
            <div className="absolute inset-0 bg-gray-100 pointer-events-none" />
            <motion.div 
              className="absolute top-0 bottom-0 bg-black"
              initial={false}
              animate={{
                left: activeTier === 'free' ? '0%' : '50%',
                width: '50%'
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button
              onClick={() => setActiveTier('free')}
              className={`relative z-10 w-1/2 md:w-48 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 ${activeTier === 'free' ? 'text-white' : 'text-gray-500 hover:text-black'}`}
            >
              <Unlock className="w-4 h-4" /> {t('courses.version_free')}
            </button>
            <button
              onClick={() => setActiveTier('premium')}
              className={`relative z-10 w-1/2 md:w-48 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 ${activeTier === 'premium' ? 'text-white' : 'text-gray-500 hover:text-black'}`}
            >
              <Lock className="w-4 h-4" /> {t('courses.premium')}
            </button>
          </div>

          {/* View Tab Switcher (Catalog/Teachers) */}
          <div className="flex gap-4 w-full md:w-auto justify-center md:justify-end px-4 md:px-6">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`py-3 md:pb-1 md:py-0 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center justify-center flex-1 md:flex-none gap-2 ${activeTab === 'catalog' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-800'}`}
            >
              <BookOpen className="w-4 h-4" /> {t('courses.tab_catalog')}
            </button>
            <button
              onClick={() => setActiveTab('teachers')}
              className={`py-3 md:pb-1 md:py-0 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors flex items-center justify-center flex-1 md:flex-none gap-2 ${activeTab === 'teachers' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-800'}`}
            >
              <User className="w-4 h-4" /> {t('courses.tab_teachers')}
            </button>
          </div>

        </div>
      </section>

      {/* Content Area */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 min-h-[50vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTier + activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {Object.entries(currentGroups).length === 0 && (
              <div className="text-center py-20 text-gray-400 font-sans uppercase tracking-widest text-sm">
                {t('courses.no_courses')}
              </div>
            )}

            <div className="flex flex-col gap-16 md:gap-24">
                {Object.entries(currentGroups).map(([groupName, courses], idx) => (
                  <div key={groupName} className="border-t border-black pt-8 md:pt-12">
                    <div className="flex justify-between items-end mb-8 md:mb-12">
                      <h2 className="text-3xl md:text-5xl font-sans font-bold uppercase tracking-tighter">
                        {groupName}
                      </h2>
                      <span className="text-xs uppercase font-bold text-gray-400 tracking-widest hidden md:block">{courses.length} {courses.length !== 1 ? t('courses.videos_count_plural') : t('courses.videos_count')}</span>
                    </div>

                    <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 pb-8 md:pb-0 snap-x snap-mandatory hide-scrollbar">
                      {courses.map((course) => (
                        <motion.div 
                          key={course.id} 
                          className="group cursor-pointer flex flex-col flex-none w-[85vw] md:w-auto snap-center"
                          whileHover="hover"
                          onClick={() => setSelectedVideo(course)}
                        >
                          <div className="relative w-full aspect-[16/9] bg-gray-100 mb-4 md:mb-6 overflow-hidden">
                            <img 
                              src={course.thumbnail} 
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0" 
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center">
                              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-500 backdrop-blur-sm">
                                <Play className="w-6 h-6 text-black ml-1" fill="currentColor" />
                              </div>
                            </div>
                            <div className="absolute bottom-4 right-4 bg-black text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                              {course.duration}
                            </div>
                            {course.tier === 'premium' && (
                              <div className="absolute top-4 left-4 bg-amber-400 text-black text-[10px] font-bold px-3 py-1 uppercase tracking-widest flex items-center gap-1">
                                <Lock className="w-3 h-3" /> PRO
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col flex-grow">
                            <h3 className="text-xl md:text-2xl font-sans font-bold uppercase tracking-tight mb-2 group-hover:text-gray-600 transition-colors leading-tight">
                              {course.title}
                            </h3>
                            <p className="text-sm font-sans text-gray-500 mb-6 line-clamp-2">
                              {course.description}
                            </p>
                            <div className="mt-auto flex justify-between items-center border-t border-gray-200 pt-4">
                              <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-gray-400" />
                                  <span className="text-xs font-bold uppercase tracking-widest text-gray-600">{course.teacher}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-10"
            onClick={() => setSelectedVideo(null)}
          >
            <div 
              className="w-full max-w-6xl h-full flex flex-col relative pt-12 md:pt-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6 z-10">
                 <div>
                   <h3 className="text-white text-xl md:text-3xl font-sans font-bold uppercase tracking-tighter flex items-center gap-3">
                     {selectedVideo.tier === 'premium' && <Lock className="w-5 h-5 text-amber-400" />}
                     {selectedVideo.title}
                   </h3>
                   <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2 hidden md:block">
                     {t('courses.teacher')}: {selectedVideo.teacher} | {selectedVideo.category}
                   </p>
                 </div>
                 <button 
                  onClick={() => setSelectedVideo(null)} 
                  className="p-3 bg-white/10 hover:bg-white text-white hover:text-black transition-colors rounded-full"
                 >
                  <X className="w-6 h-6" />
                 </button>
              </div>

              {selectedVideo.tier === 'premium' /* Here you may enforce real premium logic */ ? (
                 <div className="w-full flex-grow relative bg-black border border-white/10 shadow-2xl">
                    <iframe 
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`} 
                      title={selectedVideo.title}
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                 </div>
              ) : (
                 <div className="w-full flex-grow relative bg-black border border-white/10 shadow-2xl">
                    <iframe 
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`} 
                      title={selectedVideo.title}
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                 </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

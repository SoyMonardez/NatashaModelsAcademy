import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false, 
    },
    resources: {
      es: {
        translation: {
          nav: {
            home: "Inicio",
            about: "Nosotros",
            staff: "Staff",
            courses: "Cursos",
            models: "Modelos",
            contact: "Contacto",
            news: "Noticias",
            inscriptions: "Inscripciones",
            switch_lang: "EN",
            switch_text: "SWITCH TO ENGLISH"
          },
          home: {
            hero: {
              welcome: "Bienvenida a la excelencia.",
              explore: "Explorar"
            },
            stats: {
              graduates: "Egresados",
              years_exp: "Años Exp.",
              events: "Eventos Anuales",
              inclusive: "Inclusivo"
            },
            about: {
              title1: "BELLEZA",
              title2: "SIN",
              title3: "ETIQUETAS.",
              subtitle: "Nuestra Esencia",
              desc: "Creemos que el modelaje es una forma de expresión que no entiende de tallas ni géneros. Empoderamos a cada individuo con herramientas profesionales exclusivas para desfiles de alta gama y editoriales.",
              link: "Formación 100% Inclusiva"
            },
            courses: {
              subtitle: "Nuestra Oferta",
              title: "Módulos",
              view_all: "Ver Todos →",
              discover: "Descubrir",
              courses_data: [
                {
                  title: "Pasarela Pro",
                  desc: "Técnicas avanzadas de desplazamiento, pivot y manejo de escena para desfiles de alta gama.",
                  details: ["Técnicas de caminata y postura.", "Coreografía de alta costura.", "Pivot, vueltas y poses dinámicas.", "Control rítmico según diseño y música.", "Manejo escénico con prendas complejas."]
                },
                {
                  title: "Foto Pose",
                  desc: "Domina tu imagen ante la cámara, aprende ángulos y gestión de expresiones para editoriales.",
                  details: ["Reconocimiento de ángulos faciales y corporales.", "Técnicas de iluminación y sombras en set.", "Expresividad, acting y storytelling visual.", "Estudio de las poses editoriales contemporáneas.", "Armado de Testhoot y Portfolio profesional."]
                },
                {
                  title: "Marca Personal",
                  desc: "Protocolo, oratoria y gestión de redes sociales para convertirte en un referente de la industria.",
                  details: ["Branding personal y construcción de identidad.", "Posicionamiento orgánico en redes (Instagram/TikTok).", "Protocolo social y etiqueta en eventos de moda.", "Oratoria y entrevistas de casting.", "Planificación financiera y networking para modelos."]
                }
              ]
            },
            staff: {
              title: "Directorio",
              subtitle: "Las Fundadoras",
              v_role: "Fundadora & Dir. Académica",
              v_desc: "Especialista en desarrollo técnico, oratoria y perfeccionamiento estilístico de las nuevas promesas de la moda.",
              n_role: "Directora General & Admin",
              n_desc: "Visión y liderazgo para formar modelos preparadas para los desafíos internacionales con estándares de excelencia."
            },
            events: {
              subtitle: "Portfolio",
              title: "Eventos",
              desc: "Un recorrido visual por nuestras participaciones en pasarelas y producciones internacionales.",
              gallery: "Galería",
              portfolio: "Portfolio de Eventos"
            },
            location: {
              subtitle: "Ubicación Privada",
              title: "Nuestra Sede",
              address: "Dirección",
              phone: "Teléfono",
              inscriptions_btn: "Inscripciones Abiertas"
            },
            contact: {
              title: "Inicia Tu Carrera",
              desc: "Déjanos tus datos para coordinar una entrevista y brindarte información detallada sobre costos, horarios y las inscripciones vigentes de este año.",
              socials: "Nuestras Redes",
              form_name: "TU NOMBRE COMPLETO",
              form_email: "TU E-MAIL",
              form_phone: "TELÉFONO DE CONTACTO",
              form_message: "MENSAJE O CONSULTA",
              form_submit: "Enviar Mensaje"
            },
            modals: {
              course_detail: "Detalle del Módulo",
              course_plan: "Plan de Estudios Destacado",
              close: "Cerrar",
              enroll: "Inscribirme",
              msg_sent: "Mensaje Enviado",
              msg_desc: "Hemos recibido tus datos correctamente. Nuestro equipo se pondrá en contacto contigo a la brevedad para coordinar la entrevista.",
              accept: "Aceptar"
            }
          },
          courses: {
            subtitle: "Academia Digital",
            title: "MASTER CLASSES",
            desc: "Aprende a tu propio ritmo con nuestra biblioteca de contenido exclusivo. Formación profesional de la mano de nuestros directores y expertos de la industria.",
            search_placeholder: "BUSCAR MASTERCLASSES...",
            all_categories: "TODAS LAS CATEGORÍAS",
            version_free: "Version Free",
            premium: "Premium",
            tab_catalog: "Catálogo",
            tab_teachers: "Profesores",
            no_courses: "No hay cursos disponibles en esta sección.",
            videos_count: "Video",
            videos_count_plural: "Videos",
            teacher: "Profesor",
            data: [
              {
                id: 1, title: "Fundamentos de Pasarela", teacher: "Veronica Basso", category: "Pasarela", tier: "free", youtubeId: "WnF_z3-H574", thumbnail: "/img/f26.jpeg", duration: "12 min",
                description: "Aprende los conceptos básicos de la pasarela, postura y la caminata inicial para modelos principiantes."
              },
              {
                id: 2, title: "Expresión Facial Comercial", teacher: "Natacha Vila", category: "Foto Pose", tier: "free", youtubeId: "vD2H0lOtbXg", thumbnail: "/img/f29.jpeg", duration: "8 min",
                description: "Tips rápidos para dominar la expresión facial en sesiones de fotos comerciales."
              },
              {
                id: 3, title: "Proyección en Redes Sociales", teacher: "Natacha Vila", category: "Marca Personal", tier: "free", youtubeId: "2Xy3l1bUaE4", thumbnail: "/img/f30.jpeg", duration: "15 min",
                description: "Cómo construir tu identidad digital como modelo desde cero."
              },
              {
                id: 4, title: "Masterclass: Pasarela Alta Costura", teacher: "Veronica Basso", category: "Pasarela", tier: "premium", youtubeId: "F1HPIH2B2b8", thumbnail: "/img/f31.jpeg", duration: "45 min",
                description: "Técnicas avanzadas de desplazamiento, pivot y manejo escénico con prendas complejas para desfiles de nivel internacional."
              },
              {
                id: 5, title: "Editorial de Moda: Poses Dinámicas", teacher: "Victoria Model", category: "Foto Pose", tier: "premium", youtubeId: "tV3QW3q2dJ4", thumbnail: "/img/f32.jpeg", duration: "50 min",
                description: "Gestión de cuerpo en el espacio, acting en set e interacción con la iluminación de estudio."
              },
              {
                id: 6, title: "Casting Pro: Entrevistas y Oratoria", teacher: "Veronica Basso", category: "Marca Personal", tier: "premium", youtubeId: "R-vGk0eRbDk", thumbnail: "/img/f33.jpeg", duration: "40 min",
                description: "¿Qué decir en un casting? Oratoria, etiqueta y estrategias para destacar frente a directores de casting."
              }
            ]
          },
          models: {
            subtitle: "Nuestro Talento",
            title: "Models",
            desc: "Descubre a los perfiles que están revolucionando las pasarelas y editoriales de moda alrededor del mundo.",
            all_categories: "Todas",
            view_profile: "Ver Perfil",
            height: "Altura",
            no_models: "No se encontraron modelos en esta categoría.",
            view_all: "Ver todas",
            categories: ["Todas", "Alta Costura", "Comercial", "Editorial", "Curvy / Plus Size", "Fitness"],
            data: [
              {
                id: "1", name: "Valentina L.", category: "Alta Costura", age: 21, height: "1.78m", hair: "Castaño Claro", eyes: "Miel",
                measurements: { bust: "84cm", waist: "60cm", hips: "89cm", shoes: "39 EUR" },
                bio: "Valentina es una modelo de Alta Costura especializada en pasarelas internacionales y editoriales impresas. Ha desfilado en múltiples Fashion Weeks y colaborado con marcas de renombre como modelo principal de temporada.",
                mainImage: "https://images.unsplash.com/photo-1524504280095-2feee608832a?q=80&w=1500&auto=format&fit=crop",
                galleryImages: ["https://images.unsplash.com/photo-1542452255191-c85a98f2cb73?q=80&w=1500&auto=format&fit=crop", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1500&auto=format&fit=crop", "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1500&auto=format&fit=crop"]
              },
              {
                id: "2", name: "Martina G.", category: "Comercial", age: 24, height: "1.72m", hair: "Rubio", eyes: "Verdes",
                measurements: { bust: "88cm", waist: "64cm", hips: "92cm", shoes: "38 EUR" },
                bio: "Martina destaca en el mundo comercial y publicitario. Su rostro expresivo y sonrisa genuina la han llevado a protagonizar campañas de belleza, cuidado personal y comerciales televisivos en Argentina y Chile.",
                mainImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1500&auto=format&fit=crop",
                galleryImages: ["https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1500&auto=format&fit=crop", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1500&auto=format&fit=crop", "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?q=80&w=1500&auto=format&fit=crop"]
              },
              {
                id: "3", name: "Esteban R.", category: "Editorial", age: 26, height: "1.89m", hair: "Castaño Oscuro", eyes: "Café",
                measurements: { chest: "98cm", waist: "78cm", hips: "94cm", shoes: "44 EUR" },
                bio: "Esteban es conocido por su versatilidad ante la cámara y su estilo andrógino-chic. Se ha consolidado en editoriales de moda urbana y vanguardista, aportando una presencia magnética y fuerte a cada sesión fotográfica.",
                mainImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1500&auto=format&fit=crop",
                galleryImages: ["https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1500&auto=format&fit=crop", "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1500&auto=format&fit=crop", "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1500&auto=format&fit=crop"]
              },
              {
                id: "4", name: "Sofía M.", category: "Curvy / Plus Size", age: 23, height: "1.75m", hair: "Rojizo", eyes: "Avellana",
                measurements: { bust: "102cm", waist: "82cm", hips: "110cm", shoes: "39 EUR" },
                bio: "Pionera en la inclusión y aceptación corporal dentro de la academia. Sofía ha sido la imagen de múltiples marcas body-positive, demostrando que la elegancia y la alta moda trascienden las tallas convencionales.",
                mainImage: "https://images.unsplash.com/photo-1481214110143-ed630356e1bb?q=80&w=1500&auto=format&fit=crop",
                galleryImages: ["https://images.unsplash.com/photo-1545996124-0501ebae84d0?q=80&w=1500&auto=format&fit=crop", "https://images.unsplash.com/photo-1485230405346-71acb9518d9c?q=80&w=1500&auto=format&fit=crop", "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=1500&auto=format&fit=crop"]
              },
              {
                id: "5", name: "Julieta V.", category: "Alta Costura", age: 19, height: "1.80m", hair: "Negro", eyes: "Café Oscuro",
                measurements: { bust: "82cm", waist: "58cm", hips: "88cm", shoes: "40 EUR" },
                bio: "El nuevo gran talento de Natasha Models. Con un porte estricto y una silueta afinada, Julieta es la modelo preferida de diseñadores locales y emergentes para cerrar pasarelas de alta exposición.",
                mainImage: "https://images.unsplash.com/photo-1512397746205-0428d0ff0a32?q=80&w=1500&auto=format&fit=crop",
                galleryImages: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1500&auto=format&fit=crop", "https://images.unsplash.com/photo-1534008757030-27299c4371b6?q=80&w=1500&auto=format&fit=crop", "https://images.unsplash.com/photo-1510832198440-a52376950479?q=80&w=1500&auto=format&fit=crop"]
              },
              {
                id: "6", name: "Tomás K.", category: "Comercial / Fitness", age: 28, height: "1.85m", hair: "Rubio Oscuro", eyes: "Azules",
                measurements: { chest: "105cm", waist: "80cm", hips: "98cm", shoes: "43 EUR" },
                bio: "Especialista en campañas de deportes, salud y estilo de vida. Tomás combina su carrera de modelo con su formación en acondicionamiento físico, proyectando una imagen viril, saludable e inspiradora.",
                mainImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1500&auto=format&fit=crop",
                galleryImages: ["https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?q=80&w=1500&auto=format&fit=crop", "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1500&auto=format&fit=crop", "https://images.unsplash.com/photo-1506456182900-5e13d1000b21?q=80&w=1500&auto=format&fit=crop"]
              }
            ]
          },
          model_detail: {
            back: "Volver al Catálogo",
            height: "Estatura",
            age: "Edad",
            years: "años",
            booking: "Solicitar Booking",
            bio_title: "Biografía y Trayectoria",
            stats_title: "Medidas & Perfil Físico",
            bust: "Busto",
            chest: "Pecho",
            waist: "Cintura",
            hips: "Cadera",
            shoes: "Zapatos",
            hair: "Pelo",
            eyes: "Ojos",
            similar: "Modelos Similares"
          },
          footer: {
            desc: "Formando talentos internacionales con los más altos estándares de la industria del modelaje y la moda editorial.",
            links: "Links",
            contact: "Contacto",
            rights: "All rights reserved.",
            terms: "Términos y Condiciones",
            privacy: "Política de Privacidad"
          },
          news: {
            title: "Noticias",
            desc: "Novedades, eventos y todo lo que sucede dentro de Natasha Models Academy.",
            search_placeholder: "BUSCAR NOTICIAS...",
            read_full: "Leer Artículo Completo",
            read_more: "LEER MÁS →",
            no_news: "No se encontraron artículos en esta categoría.",
            categories: ['TODAS', 'EVENTOS', 'STAFF', 'ACADEMIA', 'MODA'],
            data: [
              { id: '1', title: 'NUESTRA CAMPAÑA EN PARÍS FASHION WEEK', date: '15 MAR 2024', category: 'EVENTOS', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800', extract: 'Un vistazo exclusivo detrás de escena donde nuestras modelos principales desfilaron para las mejores casas de moda europeas.' },
              { id: '2', title: 'ALEXANDER VON: EL FOTÓGRAFO DEL AÑO', date: '28 FEB 2024', category: 'STAFF', image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800', extract: 'Nuestro director de moda recibe el premio internacional por su contribución a la fotografía editorial contemporánea.' },
              { id: '3', title: 'CASTING NACIONAL 2024 ABRE SUS PUERTAS', date: '10 ENE 2024', category: 'ACADEMIA', image: 'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=800', extract: 'Buscamos nuevos talentos en toda Argentina. Conoce los requisitos y fechas para las próximas audiciones en tu provincia.' },
              { id: '4', title: 'TENDENCIAS DE VERANO: MINIMALISMO ABSOLUTO', date: '05 ENE 2024', category: 'MODA', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800', extract: 'Análisis de las tendencias que dominan la temporada. Por qué menos sigue siendo más en la pasarela actual.' },
              { id: '5', title: 'SOFIA LAURENT FIRMA CON AGENCIA EN MILÁN', date: '12 DIC 2023', category: 'ACADEMIA', image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800', extract: 'Orgullosos de anunciar que nuestra egresada ha firmado un contrato exclusivo en Italia.' }
            ]
          },
          inscriptions: {
            subtitle: "Únete a Nosotros",
            title: "Inscripciones",
            desc: "Completa el siguiente formulario paso a paso. Queremos conocerte para ofrecerte la mejor formación.",
            step1: "1. Datos Personales",
            name: "TU NOMBRE COMPLETO",
            dni: "DNI O PASAPORTE",
            dob: "FECHA DE CUMPLEAÑOS",
            age: "EDAD (AUTO)",
            sex: "SEXO",
            female: "Femenino",
            male: "Masculino",
            other: "Otro",
            next: "Siguiente",
            step2: "2. Contacto Local",
            origin: "ORIGEN Y PROCEDENCIA",
            from_sj: "Soy de San Juan, Argentina",
            from_prov: "Soy de otra provincia de Argentina",
            from_country: "Soy de otro País",
            dep_placeholder: "Selecciona tu departamento...",
            dep: "DEPARTAMENTO",
            prov_placeholder: "Ej: Mendoza, Córdoba...",
            prov: "¿DE QUÉ PROVINCIA ERES?",
            country_placeholder: "Ej: Chile, España, México...",
            country: "¿DE QUÉ PAÍS ERES?",
            back: "Volver",
            step3: "3. Vía de Comunicación",
            phone_desc: "Necesitamos un número de WhatsApp o móvil para que nuestra administración se ponga en contacto contigo y finalice la inscripción.",
            country_code: "PAÍS",
            phone: "TU NÚMERO (SIN CÓDIGO DE PAÍS)",
            summary: "Resumen:",
            years: "años",
            finish: "Finalizar",
            success_title: "¡Inscripción Recibida!",
            success_desc: "Gracias por tu interés en Natasha Models Academy, {{- nombre}}. Nuestra administración se contactará contigo vía WhatsApp al {{- phone}} en la brevedad.",
            another: "Realizar otra inscripción"
          },
          auth: {
            login_title: "Iniciar Sesión",
            register_title: "Crear Cuenta",
            email: "CORREO ELECTRÓNICO",
            password: "CONTRASEÑA",
            login_btn: "Ingresar",
            register_btn: "Registrarse",
            or: "O",
            google_btn: "CONTINUAR CON GOOGLE",
            no_account: "¿No tienes cuenta?",
            has_account: "¿Ya tienes cuenta?",
            register_link: "Regístrate aquí",
            login_link: "Inicia sesión aquí",
            name: "NOMBRE COMPLETO"
          },
          profile: {
            title: "Mi Perfil",
            subtitle: "Gestiona tu cuenta y formación",
            personal_info: "Información Personal",
            edit_photo: "Cambiar Foto",
            full_name: "Nombre Completo",
            email: "Correo Electrónico",
            phone: "Teléfono / WhatsApp",
            location: "Ubicación",
            save_changes: "Guardar Cambios",
            success_msg: "Perfil actualizado con éxito",
            model_status: "Estado de formación",
            status_active: "Activo / En proceso",
            logout: "Cerrar Sesión"
          }
        }
      },
      en: {
        translation: {
          nav: {
            home: "Home",
            about: "About Us",
            staff: "Staff",
            courses: "Courses",
            models: "Models",
            contact: "Contact",
            news: "News",
            inscriptions: "Enrollment",
            switch_lang: "ES",
            switch_text: "CAMBIAR A ESPAÑOL"
          },
          home: {
            hero: {
              welcome: "Welcome to excellence.",
              explore: "Explore"
            },
            stats: {
              graduates: "Graduates",
              years_exp: "Years Exp.",
              events: "Annual Events",
              inclusive: "Inclusive"
            },
            about: {
              title1: "BEAUTY",
              title2: "WITHOUT",
              title3: "LABELS.",
              subtitle: "Our Essence",
              desc: "We believe modeling is a form of expression that transcends sizes and genders. We empower each individual with exclusive professional tools for high-end runways and editorials.",
              link: "100% Inclusive Training"
            },
            courses: {
              subtitle: "Our Offer",
              title: "Modules",
              view_all: "View All →",
              discover: "Discover",
              courses_data: [
                {
                  title: "Pro Runway",
                  desc: "Advanced techniques in walk, pivot and stage management for high-end fashion shows.",
                  details: ["Walking and posture techniques.", "Haute couture choreography.", "Pivot, turns and dynamic poses.", "Rhythmic control according to design and music.", "Stage management with complex garments."]
                },
                {
                  title: "Photo Pose",
                  desc: "Master your image in front of the camera, learn angles and expression management for editorials.",
                  details: ["Recognition of facial and body angles.", "Lighting and shadows techniques on set.", "Expressiveness, acting and visual storytelling.", "Study of contemporary editorial poses.", "Creation of Test Shoot and professional Portfolio."]
                },
                {
                  title: "Personal Brand",
                  desc: "Protocol, public speaking and social media management to become an industry reference.",
                  details: ["Personal branding and identity building.", "Organic positioning on networks (Instagram/TikTok).", "Social protocol and etiquette in fashion events.", "Public speaking and casting interviews.", "Financial planning and networking for models."]
                }
              ]
            },
            staff: {
              title: "Directory",
              subtitle: "The Founders",
              v_role: "Founder & Academic Dir.",
              v_desc: "Specialist in technical development, public speaking, and stylistic refinement of new fashion talents.",
              n_role: "General Director & Admin",
              n_desc: "Vision and leadership to train models ready for international challenges with standards of excellence."
            },
            events: {
              subtitle: "Portfolio",
              title: "Events",
              desc: "A visual journey through our participations in international runways and productions.",
              gallery: "Gallery",
              portfolio: "Events Portfolio"
            },
            location: {
              subtitle: "Private Location",
              title: "Our Headquarters",
              address: "Address",
              phone: "Phone",
              inscriptions_btn: "Open Enrollments"
            },
            contact: {
              title: "Start Your Career",
              desc: "Leave your details to schedule an interview and provide you with detailed information on costs, schedules, and this year's open enrollments.",
              socials: "Our Socials",
              form_name: "YOUR FULL NAME",
              form_email: "YOUR E-MAIL",
              form_phone: "CONTACT PHONE",
              form_message: "MESSAGE OR INQUIRY",
              form_submit: "Send Message"
            },
            modals: {
              course_detail: "Module Detail",
              course_plan: "Featured Study Plan",
              close: "Close",
              enroll: "Enroll",
              msg_sent: "Message Sent",
              msg_desc: "We have correctly received your details. Our team will contact you shortly to schedule the interview.",
              accept: "Accept"
            }
          },
          courses: {
            subtitle: "Digital Academy",
            title: "MASTER CLASSES",
            desc: "Learn at your own pace with our exclusive content library. Professional training from our directors and industry experts.",
            search_placeholder: "SEARCH MASTERCLASSES...",
            all_categories: "ALL CATEGORIES",
            version_free: "Free Version",
            premium: "Premium",
            tab_catalog: "Catalog",
            tab_teachers: "Teachers",
            no_courses: "There are no courses available in this section.",
            videos_count: "Video",
            videos_count_plural: "Videos",
            teacher: "Teacher",
            data: [
              {
                id: 1, title: "Runway Fundamentals", teacher: "Veronica Basso", category: "Runway", tier: "free", youtubeId: "WnF_z3-H574", thumbnail: "/img/f26.jpeg", duration: "12 min",
                description: "Learn the basics of runway, posture, and initial walk for beginner models."
              },
              {
                id: 2, title: "Commercial Facial Expression", teacher: "Natacha Vila", category: "Photo Pose", tier: "free", youtubeId: "vD2H0lOtbXg", thumbnail: "/img/f29.jpeg", duration: "8 min",
                description: "Quick tips to master your facial expression in commercial photo shoots."
              },
              {
                id: 3, title: "Social Media Projection", teacher: "Natacha Vila", category: "Personal Brand", tier: "free", youtubeId: "2Xy3l1bUaE4", thumbnail: "/img/f30.jpeg", duration: "15 min",
                description: "How to build your digital identity as a model from scratch."
              },
              {
                id: 4, title: "Masterclass: Haute Couture Runway", teacher: "Veronica Basso", category: "Runway", tier: "premium", youtubeId: "F1HPIH2B2b8", thumbnail: "/img/f31.jpeg", duration: "45 min",
                description: "Advanced walking techniques, pivot, and stage management with complex garments for international level fashion shows."
              },
              {
                id: 5, title: "Fashion Editorial: Dynamic Poses", teacher: "Victoria Model", category: "Photo Pose", tier: "premium", youtubeId: "tV3QW3q2dJ4", thumbnail: "/img/f32.jpeg", duration: "50 min",
                description: "Space management, acting on set, and interaction with studio lighting."
              },
              {
                id: 6, title: "Casting Pro: Entrevistas & Oratoria", teacher: "Veronica Basso", category: "Personal Brand", tier: "premium", youtubeId: "R-vGk0eRbDk", thumbnail: "/img/f33.jpeg", duration: "40 min",
                description: "What to say at a casting? Public speaking, etiquette, and strategies to stand out in front of casting directors."
              }
            ]
          },
          models: {
            subtitle: "Our Talent",
            title: "Models",
            desc: "Discover the profiles that are revolutionizing runways and fashion editorials around the world.",
            all_categories: "All",
            view_profile: "View Profile",
            height: "Height",
            no_models: "No models found in this category.",
            view_all: "View all",
            categories: ["All", "Haute Couture", "Commercial", "Editorial", "Curvy / Plus Size", "Fitness"],
            data: [
              {
                id: "1", name: "Valentina L.", category: "Haute Couture", age: 21, height: "1.78m", hair: "Light Brown", eyes: "Hazel",
                measurements: { bust: "84cm", waist: "60cm", hips: "89cm", shoes: "39 EUR" },
                bio: "Valentina is an Haute Couture model specialized in international runways and printed editorials. She has walked multiple Fashion Weeks and collaborated with renowned brands as the main seasonal model.",
                mainImage: "https://images.unsplash.com/photo-1524504280095-2feee608832a?q=80&w=1500&auto=format&fit=crop",
                galleryImages: ["https://images.unsplash.com/photo-1542452255191-c85a98f2cb73?q=80&w=1500&auto=format&fit=crop", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1500&auto=format&fit=crop", "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1500&auto=format&fit=crop"]
              },
              {
                id: "2", name: "Martina G.", category: "Commercial", age: 24, height: "1.72m", hair: "Blonde", eyes: "Green",
                measurements: { bust: "88cm", waist: "64cm", hips: "92cm", shoes: "38 EUR" },
                bio: "Martina stands out in the commercial and advertising world. Her expressive face and genuine smile have led her to star in beauty campaigns, personal care, and television commercials in Argentina and Chile.",
                mainImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1500&auto=format&fit=crop",
                galleryImages: ["https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1500&auto=format&fit=crop", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1500&auto=format&fit=crop", "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?q=80&w=1500&auto=format&fit=crop"]
              },
              {
                id: "3", name: "Esteban R.", category: "Editorial", age: 26, height: "1.89m", hair: "Dark Brown", eyes: "Brown",
                measurements: { chest: "98cm", waist: "78cm", hips: "94cm", shoes: "44 EUR" },
                bio: "Esteban is known for his versatility in front of the camera and his androgynous-chic style. He has established himself in urban and avant-garde fashion editorials, bringing a magnetic and strong presence to each photoshoot.",
                mainImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1500&auto=format&fit=crop",
                galleryImages: ["https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1500&auto=format&fit=crop", "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1500&auto=format&fit=crop", "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1500&auto=format&fit=crop"]
              },
              {
                id: "4", name: "Sofía M.", category: "Curvy / Plus Size", age: 23, height: "1.75m", hair: "Redhead", eyes: "Hazel",
                measurements: { bust: "102cm", waist: "82cm", hips: "110cm", shoes: "39 EUR" },
                bio: "A pioneer in inclusion and body acceptance within the academy. Sofia has been the image of multiple body-positive brands, proving that elegance and high fashion transcend conventional sizes.",
                mainImage: "https://images.unsplash.com/photo-1481214110143-ed630356e1bb?q=80&w=1500&auto=format&fit=crop",
                galleryImages: ["https://images.unsplash.com/photo-1545996124-0501ebae84d0?q=80&w=1500&auto=format&fit=crop", "https://images.unsplash.com/photo-1485230405346-71acb9518d9c?q=80&w=1500&auto=format&fit=crop", "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=1500&auto=format&fit=crop"]
              },
              {
                id: "5", name: "Julieta V.", category: "Haute Couture", age: 19, height: "1.80m", hair: "Black", eyes: "Dark Brown",
                measurements: { bust: "82cm", waist: "58cm", hips: "88cm", shoes: "40 EUR" },
                bio: "The new big talent of Natasha Models. With a strict bearing and a refined silhouette, Julieta is the preferred model of local and emerging designers to close high-exposure runways.",
                mainImage: "https://images.unsplash.com/photo-1512397746205-0428d0ff0a32?q=80&w=1500&auto=format&fit=crop",
                galleryImages: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1500&auto=format&fit=crop", "https://images.unsplash.com/photo-1534008757030-27299c4371b6?q=80&w=1500&auto=format&fit=crop", "https://images.unsplash.com/photo-1510832198440-a52376950479?q=80&w=1500&auto=format&fit=crop"]
              },
              {
                id: "6", name: "Tomás K.", category: "Commercial / Fitness", age: 28, height: "1.85m", hair: "Dark Blonde", eyes: "Blue",
                measurements: { chest: "105cm", waist: "80cm", hips: "98cm", shoes: "43 EUR" },
                bio: "Specialist in sports, health, and lifestyle campaigns. Tomas combines his modeling career with his fitness training, projecting a virile, healthy, and inspiring image.",
                mainImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1500&auto=format&fit=crop",
                galleryImages: ["https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?q=80&w=1500&auto=format&fit=crop", "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1500&auto=format&fit=crop", "https://images.unsplash.com/photo-1506456182900-5e13d1000b21?q=80&w=1500&auto=format&fit=crop"]
              }
            ]
          },
          model_detail: {
            back: "Back to Catalog",
            height: "Height",
            age: "Age",
            years: "years",
            booking: "Request Booking",
            bio_title: "Biography and Career",
            stats_title: "Measurements & Physical Profile",
            bust: "Bust",
            chest: "Chest",
            waist: "Waist",
            hips: "Hips",
            shoes: "Shoes",
            hair: "Hair",
            eyes: "Eyes",
            similar: "Similar Models"
          },
          footer: {
            desc: "Training international talents with the highest standards in the modeling and editorial fashion industry.",
            links: "Links",
            contact: "Contact",
            rights: "All rights reserved.",
            terms: "Terms & Conditions",
            privacy: "Privacy Policy"
          },
          news: {
            title: "News",
            desc: "News, events and everything that happens inside Natasha Models Academy.",
            search_placeholder: "SEARCH NEWS...",
            read_full: "Read Full Article",
            read_more: "READ MORE →",
            no_news: "No articles found in this category.",
            categories: ['ALL', 'EVENTS', 'STAFF', 'ACADEMY', 'FASHION'],
            data: [
              { id: '1', title: 'OUR CAMPAIGN AT PARIS FASHION WEEK', date: 'MAR 15 2024', category: 'EVENTS', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800', extract: 'An exclusive behind-the-scenes look where our top models walked for the best European fashion houses.' },
              { id: '2', title: 'ALEXANDER VON: PHOTOGRAPHER OF THE YEAR', date: 'FEB 28 2024', category: 'STAFF', image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800', extract: 'Our fashion director receives the international award for his contribution to contemporary editorial photography.' },
              { id: '3', title: 'NATIONAL CASTING 2024 OPEN CALL', date: 'JAN 10 2024', category: 'ACADEMY', image: 'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=800', extract: 'We are looking for new talents all over Argentina. Learn about the requirements and dates for the upcoming auditions in your province.' },
              { id: '4', title: 'SUMMER TRENDS: ABSOLUTE MINIMALISM', date: 'JAN 05 2024', category: 'FASHION', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800', extract: 'Analysis of the trends pushing the season. Why less is still more on the current runway.' },
              { id: '5', title: 'SOFIA LAURENT SIGNS WITH MILAN AGENCY', date: 'DEC 12 2023', category: 'ACADEMY', image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800', extract: 'Proud to announce that our graduate has signed an exclusive contract in Italy.' }
            ]
          },
          inscriptions: {
            subtitle: "Join Us",
            title: "Enrollment",
            desc: "Complete the following form step by step. We want to know you to offer you the best training.",
            step1: "1. Personal Information",
            name: "YOUR FULL NAME",
            dni: "ID OR PASSPORT",
            dob: "DATE OF BIRTH",
            age: "AGE (AUTO)",
            sex: "SEX",
            female: "Female",
            male: "Male",
            other: "Other",
            next: "Next",
            step2: "2. Local Contact",
            origin: "ORIGIN AND PROCEDENCE",
            from_sj: "I am from San Juan, Argentina",
            from_prov: "I am from another province in Argentina",
            from_country: "I am from another Country",
            dep_placeholder: "Select your department...",
            dep: "DEPARTMENT",
            prov_placeholder: "Eg: Mendoza, Córdoba...",
            prov: "WHICH PROVINCE ARE YOU FROM?",
            country_placeholder: "Eg: Chile, Spain, Mexico...",
            country: "WHICH COUNTRY ARE YOU FROM?",
            back: "Back",
            step3: "3. Communication Channel",
            phone_desc: "We need a WhatsApp or mobile number so our administration can contact you and finalize the enrollment.",
            country_code: "COUNTRY",
            phone: "YOUR NUMBER (WITHOUT COUNTRY CODE)",
            summary: "Summary:",
            years: "years",
            finish: "Finish",
            success_title: "Enrollment Received!",
            success_desc: "Thank you for your interest in Natasha Models Academy, {{- nombre}}. Our administration will contact you via WhatsApp at {{- phone}} shortly.",
            another: "Make another enrollment"
          },
          auth: {
            login_title: "Log In",
            register_title: "Create Account",
            email: "EMAIL ADDRESS",
            password: "PASSWORD",
            login_btn: "Log In",
            register_btn: "Sign Up",
            or: "OR",
            google_btn: "CONTINUE WITH GOOGLE",
            no_account: "Don't have an account?",
            has_account: "Already have an account?",
            register_link: "Sign up here",
            login_link: "Log in here",
            name: "FULL NAME"
          },
          profile: {
            title: "My Profile",
            subtitle: "Manage your account and training",
            personal_info: "Personal Information",
            edit_photo: "Change Photo",
            full_name: "Full Name",
            email: "Email Address",
            phone: "Phone / WhatsApp",
            location: "Location",
            save_changes: "Save Changes",
            success_msg: "Profile updated successfully",
            model_status: "Training Status",
            status_active: "Active / In progress",
            logout: "Log Out"
          }
        }
      }
    }
  });

export default i18n;

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import emailRoutes from './routes/emailRoutes';
import modelRoutes from './routes/modelRoutes';
import courseRoutes from './routes/courseRoutes';
import newsRoutes from './routes/newsRoutes';
import carouselRoutes from './routes/carouselRoutes';
import submissionRoutes from './routes/submissionRoutes';
import adminRoutes from './routes/adminRoutes';
import cartRoutes from './routes/cartRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/carousel', carouselRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);

// Base route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Natasha Models Academy API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Error handling middleware for Multer and other errors
import { MulterError } from 'multer';

app.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'Imagen demasiado pesada', 
        details: 'El tamaño máximo permitido es 10MB por foto' 
      });
    }
    return res.status(400).json({ error: 'Error al subir imagen', details: err.message });
  }
  
  console.error('Unhandled Error:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor', 
    details: err.message || 'Error desconocido' 
  });
});

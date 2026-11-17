import http from 'http';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

// Charge les variables du fichier .env en développement local
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// 1. Middlewares de sécurité et parsing
app.use(helmet()); // Sécurise les en-têtes HTTP (bonne pratique DevSecOps)
app.use(cors());
app.use(express.json());

// 2. Création du serveur HTTP partagé entre Express (REST) et Socket.io (Temps réel)
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*', // À restreindre en production au domaine de l'app
    methods: ['GET', 'POST'],
  },
});

// Compteur de connexions WebSocket actives (utile pour le monitoring DevOps)
let activeWsConnections = 0;

io.on('connection', (socket) => {
  activeWsConnections++;
  console.log(`[WS] Client connecté (${socket.id}) - Total actifs: ${activeWsConnections}`);

  // Rejoindre le salon temps réel d'une sortie spécifique (ex: sortie #42)
  socket.on('join_outing', (outingId: string) => {
    socket.join(`outing_${outingId}`);
    console.log(`[WS] Client ${socket.id} a rejoint la sortie outing_${outingId}`);
  });

  socket.on('disconnect', () => {
    activeWsConnections--;
    console.log(`[WS] Client déconnecté (${socket.id}) - Total actifs: ${activeWsConnections}`);
  });
});

// 3. Endpoint /health : INDISPENSABLE en DevOps (Docker Healthcheck & Kubernetes Probes)
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'UP',
    environment: NODE_ENV,
    uptimeSeconds: Math.floor(process.uptime()),
    activeWebSockets: activeWsConnections,
    timestamp: new Date().toISOString(),
  });
});

// 4. Démarrage du serveur
const server = httpServer.listen(PORT, () => {
  console.log(`🚀 [Backend] Serveur démarré sur le port ${PORT} (env: ${NODE_ENV})`);
});

// 5. Graceful Shutdown (Arrêt gracieux pour le Zero-Downtime Deployment)
const shutdown = (signal: string) => {
  console.log(`\n🛑 Signal ${signal} reçu. Fermeture propre des connexions en cours...`);
  io.close(() => {
    console.log('✅ Toutes les connexions WebSocket sont fermées.');
    server.close(() => {
      console.log('✅ Serveur HTTP arrêté proprement.');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

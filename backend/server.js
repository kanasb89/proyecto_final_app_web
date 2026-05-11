const express    = require('express');
const http       = require('http');
const cors       = require('cors');
const { Server } = require('socket.io');
const { Pool, Client } = require('pg');

const PORT = 3000;

const DB_CONFIG = {
  host:     'localhost',
  port:     5433,
  database: 'ProyectoWEB',
  user:     'admin',
  password: '123456',
};

const app    = express();
const server = http.createServer(app);

app.use(cors({ origin: '*' }));
app.use(express.json());

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

const pool = new Pool(DB_CONFIG);

app.get('/api/friends', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM my_friends ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CLIENTE ESCUCHA (LISTEN)
const notifyClient = new Client(DB_CONFIG);

async function setupNotifyListener() {
  try {
    await notifyClient.connect();

    //Canal que debe coincidir exactamente con el trigger SQL
    await notifyClient.query('LISTEN my_friends_updates');
    console.log('Escuchando canal: my_friends_updates');

    notifyClient.on('notification', (msg) => {
      try {
        const payload = JSON.parse(msg.payload);
        console.log('Cambio detectado en DB:', payload);
        io.emit('db_update', payload);
        console.log(`Evento emitido a ${io.engine.clientsCount} cliente(s)`);
      } catch (err) {
        console.error('Error parseando payload:', err.message);
      }
    });

    notifyClient.on('error', (err) => {
      console.error('Error en notifyClient:', err.message);
      setTimeout(setupNotifyListener, 5000);
    });

  } catch (err) {
    console.error('Error PG Notify:', err.message);
    setTimeout(setupNotifyListener, 5000);
  }
}

io.on('connection', (socket) => {
  console.log('Cliente Angular conectado:', socket.id);
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

server.listen(PORT, async () => {
  console.log(`Servidor en http://localhost:${PORT}`);
  await setupNotifyListener();
});

process.on('SIGINT', async () => {
  await notifyClient.end();
  await pool.end();
  process.exit(0);
});
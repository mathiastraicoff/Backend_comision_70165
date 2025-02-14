import { Router } from 'express';
import fetch from 'node-fetch';

const proxyRouter = Router();

// Endpoint proxy para ipinfo.io
proxyRouter.get('/ipinfo', async (req, res) => { 
    try {
        const token = process.env.IPINFO_TOKEN;
        if (!token) {
            return res.status(500).json({ error: 'Falta el token de ipinfo.io en el servidor.' });
        }
        const fetchWithTimeout = (url, options, timeout = 5000) => {
            return Promise.race([
                fetch(url, options),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Tiempo de espera excedido')), timeout)
                ),
            ]);
        };

        const response = await fetchWithTimeout(`https://ipinfo.io?token=${token}`);
        
        if (!response.ok) {
            return res.status(response.status).json({
                error: `Error al obtener datos de ipinfo.io: ${response.statusText}`,
            });
        }

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error('Error al obtener información de IP:', error.message);
        res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message,
        });
    }
});

export default proxyRouter;

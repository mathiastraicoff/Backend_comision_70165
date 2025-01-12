import { Router } from 'express';
import passport from 'passport';

const router = Router();

// Ruta protegida
router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ message: 'Acceso permitido', user: req.user });
});

export default router;

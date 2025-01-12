
import dotenv from "dotenv";
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UserService from '../service/UserManager.js';

dotenv.config();

if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET no está definido en el archivo .env");
    process.exit(1);
}

// Estrategia Local
export const configureLocalStrategy = (passport) => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
            },
            async (email, password, done) => {
                try {
                    const user = await UserService.getUserByEmail(email);
                    if (!user) {
                        return done(null, false, { message: 'Usuario no encontrado' });
                    }

                    const isValidPassword = await UserService.comparePassword(password, user.password);
                    if (!isValidPassword) {
                        return done(null, false, { message: 'Contraseña incorrecta' });
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
};

// Estrategia JWT
export const configureJwtStrategy = (passport) => {
    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: process.env.JWT_SECRET,
            },
            async (jwtPayload, done) => {
                try {
                    const user = await UserService.getUserById(jwtPayload.id);
                    if (!user) {
                        return done(null, false);
                    }
                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
};

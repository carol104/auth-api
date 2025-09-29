import 'dotenv/config';
import {get} from 'env-var';

// Debug: Mostrar variables de entorno cargadas
console.log('🔍 Variables de entorno raw:', {
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
});

export const envs={
    PORT: get('PORT').required().asPortNumber(),
    DB_PORT: get('DB_PORT').required().asPortNumber(),
    DB_HOST:get('DB_HOST').required().asString(),
    DB_USER:get('DB_USER').required().asString(),
    DB_PASS: get('DB_PASS').required().asString(),
    DB_NAME: get('DB_NAME').required().asString(),
    JWT_SEED: get('JWT_SEED').required().asString(),
}

// Debug: Mostrar variables procesadas
console.log('🔍 Variables de entorno procesadas:', {
    DB_HOST: envs.DB_HOST,
    DB_PORT: envs.DB_PORT,
    DB_USER: envs.DB_USER,
    DB_PASS: envs.DB_PASS,
    DB_NAME: envs.DB_NAME,
});
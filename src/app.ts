import "reflect-metadata";
import { Server } from "./presentation/server";
import { AppRoutes } from "./presentation/routes";
import { envs } from "./config/envs";
import { AppDataSource } from "./data/postgres/data-source";


(()=>{
main();
})()

async function main(){
    try {
        // Intentar conectar a la base de datos
        await AppDataSource.initialize();
        console.log("✅ Conexión exitosa a PostgreSQL con TypeORM");

        // Iniciar el servidor
        const server = new Server({
            port: envs.PORT,
            routes: AppRoutes.routes
        });
        
        await server.start();
        console.log(`🚀 Servidor corriendo en puerto ${envs.PORT}`);

    } catch (error: any) {
        if (error.code === '28P01') {
            console.error("❌ Error de autenticación en PostgreSQL: contraseña incorrecta para el usuario");
            console.error("👉 Verifica las credenciales en .env y docker-compose.yml");
        } 
        else if (error.code === 'ECONNREFUSED') {
            console.error("❌ No se pudo conectar a PostgreSQL");
            console.error("👉 Verifica que el contenedor de Docker esté corriendo");
        }
        else if (error instanceof Error) {
            console.error("❌ Error al iniciar la aplicación:", error.message);
        } 
        else {
            console.error("❌ Error desconocido:", error);
        }
        
        // Salir con código de error
        process.exit(1);
    }
}
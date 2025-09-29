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
        console.log('🔄 Iniciando conexión a PostgreSQL...');
        
        // Intentar conectar a la base de datos
        await AppDataSource.initialize();
        console.log("✅ Conexión exitosa a PostgreSQL con TypeORM");

        // Probar la conexión
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        console.log("✅ Prueba de conexión exitosa");
        await queryRunner.release();

        // Iniciar el servidor
        const server = new Server({
            port: envs.PORT,
            routes: AppRoutes.routes
        });
        
        await server.start();
        console.log(`🚀 Servidor corriendo en puerto ${envs.PORT}`);

    } catch (error: any) {
        console.error('❌ Error detallado:', {
            code: error.code,
            errno: error.errno,
            syscall: error.syscall,
            address: error.address,
            port: error.port,
            message: error.message,
            stack: error.stack
        });

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
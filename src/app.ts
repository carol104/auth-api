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
    await AppDataSource.initialize();
    console.log("Conectado a PostgreSQL con TypeORM");

    new Server({
      port: envs.PORT,
      routes: AppRoutes.routes
    }).start();

  } catch (error) {
    console.error("Error al iniciar la aplicación:", error);
  }

}
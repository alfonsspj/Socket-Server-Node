import { createServer } from 'http';
import { envs } from './config/envs';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';
import { WssService } from './presentation/services/wss.service';


(async()=> {
  main();
})();


function main() {

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });


  const httpServer = createServer( server.app );// tenemos un servidor con la misma configuracion que "server"

  WssService.initWss({ server: httpServer });



  // server.start();// sevidor de express
  httpServer.listen( envs.PORT, () => {
    console.log(`Server running on port: ${ envs.PORT }`);
  })
}
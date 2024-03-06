// singleton porque solo necesito una instancia de mi websocketserver
// conectar express como websocketserver en el mismo servidor
import { Server } from 'http';
import { WebSocket, WebSocketServer } from 'ws';


interface Options {
    server: Server;
    path?: string; // ws
}

export class WssService {

    private static _instance: WssService; // _instance guarda la instancia inicializada
    private wss: WebSocketServer;

    private constructor( options: Options ) {
        const { server, path = '/ws' } = options;// localhost:3000/ws

        this.wss = new WebSocketServer({ server, path });
        this.start();
    }

    static get intance(): WssService {
        if( !WssService._instance ) {
            throw 'WssService is not initialized'
        }

        return WssService._instance;
    }

    static initWss( options: Options ) {
        WssService._instance = new WssService( options );
    }


    public start() {

        this.wss.on('connection', (ws: WebSocket) => {

            console.log('Client connected');


            ws.on('close', () => console.log('Client disconnected'));
        })
    }

}
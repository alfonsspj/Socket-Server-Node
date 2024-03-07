import { Router } from "express";
import { TicketController } from "./controller";



export class TicketRoutes {

    static get routes() {

        const router = Router();
        const ticketController = new TicketController();


        router.get('/', ticketController.getTickets);
        router.get('/last', ticketController.getLastTicketNumber);
        router.get('/pending', ticketController.pendingTickets);

        router.post('/', ticketController.createTickets);

        router.get('/draw/:desk', ticketController.drawTicket);// tomar un ticket y automaticamente asignarle a este escritorio
        router.put('/done/:ticketId', ticketController.ticketFinished);// para decir que el ticket ya esta terminado

        router.get('/working-on', ticketController.workingOn); // mostrar los tickets que se estan trabajando en este momento


        return router;
    }
}
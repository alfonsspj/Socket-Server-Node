import { UuidAdapter } from "../../config/uuid.adapter";
import { Ticket } from "../../domain/interfaces/ticket";



export class TicketService { // los tickets que se estan atendiendo y toda su lógica

    private readonly tickets: Ticket[] = [
        { id: UuidAdapter.v4(), number: 1, createAt: new Date(), done: false },
        { id: UuidAdapter.v4(), number: 2, createAt: new Date(), done: false },
        { id: UuidAdapter.v4(), number: 3, createAt: new Date(), done: false },
        { id: UuidAdapter.v4(), number: 4, createAt: new Date(), done: false },
        { id: UuidAdapter.v4(), number: 5, createAt: new Date(), done: false },
        { id: UuidAdapter.v4(), number: 6, createAt: new Date(), done: false },
    ];


    // pendientes -- no tienen handleAtDesk ( no tiene valor )
    public get pendingTickets(): Ticket[] {
        return this.tickets.filter( ticket => !ticket.handleAtDesk );
    }

    // último num de ticket --         -- tomar el utlimo
    public lastTicketNumber(): number {
        return this.tickets.length > 0 ? this.tickets.at(-1)!.number : 0;
    }

    // creacion
    public createTicket() {

        const ticket: Ticket = {
            id: UuidAdapter.v4(),
            number: this.lastTicketNumber() + 1,
            createAt: new Date(),
            done: false,
            handleAt: undefined,
            handleAtDesk: undefined,
        }

        this.tickets.push( ticket );

        // Todo: WS

        return ticket;
    }

    public drawTicket( desk: string ) {

        const ticket = this.tickets.find( t => !t.handleAtDesk ); // el primero que este nulo
        if( !ticket ) return { status: 'error', message: 'No hay tickets pendientes' };

        ticket.handleAtDesk = desk;
        ticket.handleAt = new Date();

        // todo: WS

        return { status: 'ok', ticket }
    }

    public onFinishedTicket( id: string ) {
        const ticket = this.tickets.find( t => t.id === id );
        if( !ticket ) return { status: 'error', message: 'Ticket no encontrado' };

        this.tickets.map( ticket => {

            if( ticket.id === id ) {
                ticket.done = true;
            }

            return ticket;
        });

        return { status: 'ok' };
    }
}
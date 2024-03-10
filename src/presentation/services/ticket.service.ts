import { UuidAdapter } from "../../config/uuid.adapter";
import { Ticket } from "../../domain/interfaces/ticket";
import { WssService } from './wss.service';


export class TicketService { // los tickets que se estan atendiendo y toda su lógica

    constructor(
        private readonly wssService = WssService.instance,
    ) {}

    public readonly tickets: Ticket[] = [
        { id: UuidAdapter.v4(), number: 1, createAt: new Date(), done: false },
        { id: UuidAdapter.v4(), number: 2, createAt: new Date(), done: false },
        { id: UuidAdapter.v4(), number: 3, createAt: new Date(), done: false },
        { id: UuidAdapter.v4(), number: 4, createAt: new Date(), done: false },
        { id: UuidAdapter.v4(), number: 5, createAt: new Date(), done: false },
        { id: UuidAdapter.v4(), number: 6, createAt: new Date(), done: false },
    ];

    private readonly workingOnTickets: Ticket[] = [];// tickets que queremos mostrar en pantalla


    // pendientes -- no tienen handleAtDesk ( no tiene valor )
    public get pendingTickets(): Ticket[] {
        return this.tickets.filter( ticket => !ticket.handleAtDesk );
    }

    // pantalla que muestra los 4 utlimos tickets que se estan trabajando
    public get lastWorkingOnTickets(): Ticket[] {
        return this.workingOnTickets.splice(0, 4);// tomar los ultimos 4
    }

    // último num de ticket --         -- tomar el utlimo
    public get lastTicketNumber(): number {
        return this.tickets.length > 0 ? this.tickets.at(-1)!.number : 0;
    }

    // creacion
    public createTicket() {

        const ticket: Ticket = {
            id: UuidAdapter.v4(),
            number: this.lastTicketNumber + 1,
            createAt: new Date(),
            done: false,
            handleAt: undefined,
            handleAtDesk: undefined,
        }

        this.tickets.push( ticket );
        this.onTicketNumberChanged();

        return ticket;
    }

    public drawTicket( desk: string ) {

        const ticket = this.tickets.find( t => !t.handleAtDesk ); // el primero que este nulo
        if( !ticket ) return { status: 'error', message: 'No hay tickets pendientes' };

        ticket.handleAtDesk = desk;
        ticket.handleAt = new Date();


        this.workingOnTickets.unshift({ ...ticket });
        // todo: WS
        this.onTicketNumberChanged();
        // this.onWorkingOnChanged();
    


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


    private onTicketNumberChanged() {
        this.wssService.sendMessage('on-ticket-count-changed', this.pendingTickets.length );
    }

    // private onWorkingOnChanged() {
    //     this.wssService.sendMessage('on-working-changed', this.lastWorkingOnTickets );
    // }
}
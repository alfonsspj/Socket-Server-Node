

export interface Ticket {
    id: string;
    number: number;
    createAt: Date;
    handleAtDesk?: string; // Escritorio 1, 2
    handleAt?: Date; // cuando se esta trabajando
    done: boolean; // indica cuando se termino
}

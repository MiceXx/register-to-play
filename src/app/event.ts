export interface Event {
    title: string;
    date: Date;
    location: string;
    description: string;
}

export interface EventId extends Event {
    id: string;
}

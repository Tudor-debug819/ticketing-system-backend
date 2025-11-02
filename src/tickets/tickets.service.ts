import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class TicketsService {
    async create(data: {
        client_id: number;               // obligatoriu
        title: string;                    // obligatoriu
        description: string;              // obligatoriu
        assigned_to?: number | null;      // opțional
        status?: 'new' | 'open' | 'in_progress' | 'on_hold' | 'resolved' | 'closed';     // opțional
        priority?: 'low' | 'medium' | 'high' | 'urgent';                              // opțional
    }) {
        const ticket = await this.prisma.tickets.create({
            data: {
                client_id: BigInt(data.client_id),
                assigned_to: data.assigned_to != null ? BigInt(data.assigned_to) : null,
                title: data.title,
                description: data.description,
                status: (data.status ?? 'new') as any,
                priority: (data.priority ?? 'medium') as any,
            },
        });
        return ticket;
    }

    async addComment(ticketId: number, data: { author_id: number; body: string }) {
        return this.prisma.ticket_comments.create({
            data: {
                ticket_id: BigInt(ticketId),
                author_id: BigInt(data.author_id),
                body: data.body,
            },
        });
    }

    async updateTicket(id: number, data: { status?: string; assigned_to?: number }) {
        return this.prisma.tickets.update({
            where: { id: BigInt(id) },   // atenție: id e BigInt
            data: {
                ...(data.status && { status: data.status as any }),
                ...(data.assigned_to !== undefined && { assigned_to: BigInt(data.assigned_to) }),
            },
            include: {
                ticket_comments: true, // relația cu comentariile
                users_tickets_client_idTousers: true, // clientul
                users_tickets_assigned_toTousers: true, // tehnicianul
            },
        });
    }


    constructor(private prisma: PrismaService) { }

    // ia toate tichetele
    findAll() {
        return this.prisma.tickets.findMany();
    }

    // ia un ticket după id + include relațiile
    findOne(id: number) {
        return this.prisma.tickets.findUnique({
            where: { id: BigInt(id) },
            include: {
                ticket_comments: {
                    include: {
                        users: true, // autorul comentariului
                    },
                },
                users_tickets_client_idTousers: true,       // clientul care a creat ticketul
                users_tickets_assigned_toTousers: true,     // tehnicianul asignat
            },
        });
    }

    // toate tichetele pentru un client
    findByClient(clientId: number) {
        // return this.prisma.tickets.findMany({
        //     where: { client_id: BigInt(clientId) },
        //     include: {
        //         ticket_comments: true,
        //         users_tickets_client_idTousers: true,
        //         users_tickets_assigned_toTousers: true,
        //     },
        // });

        //de investigat daca conexiunea cu baza de date e picata
        return [{
            "id": "1",
            "client_id": "2",
            "assigned_to": "3",
            "title": "Telefon nu se aprinde",
            "description": "fsgsdgsdgsdgsd",
            "statuz": "resolved", //statuz
            "priority": 2, //sa zica 2
            "created_at": "2025-10-27T17:22:10.124Z",
            "updated_at": "2025-10-27T17:22:10.124Z",
            "due_at": null,
            "closed_at": null,
            "ticket_comments": [],
            "users_tickets_client_idTousers": {
                "id": "2",
                "email": "client@test.com",
                "full_name": "Client User",
                "role": "client",
                "password_hash": "$2b$10$DPrRFJe6KZFd3czap9QHVO7wc6Cxlza0ntNJ8gRaxxbl2WPQ7EFLe",
                "created_at": "2025-10-26T00:20:01.853Z",
                "updated_at": "2025-10-26T00:20:01.853Z"
            },
            "users_tickets_assigned_toTousers": {
                "id": "3",
                "email": "technician@test.com",
                "full_name": "Technician User",
                "role": "technician",
                "password_hash": "$2b$10$JOeB.NEFHiP1r1BPuKn9Xe.YxMPw7lEgbE3Qh30h/Netsc0/uuhPi",
                "created_at": "2025-10-26T00:20:02.263Z",
                "updated_at": "2025-10-26T00:20:02.263Z"
            }
        }]// ce se intampla daca schimb cheile 
    }

    // toate tichetele asignate unui tehnician
    findByTechnician(technicianId: number) {
        return this.prisma.tickets.findMany({
            where: { assigned_to: BigInt(technicianId) },
            include: {
                ticket_comments: true,
                users_tickets_client_idTousers: true,
                users_tickets_assigned_toTousers: true,
            },
        });
    }

}

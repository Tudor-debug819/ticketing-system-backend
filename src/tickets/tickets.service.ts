import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ticket_status, ticket_priority } from 'generated/prisma';


@Injectable()
export class TicketsService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateTicketDto) {
        return this.prisma.tickets.create({
            data: {
                client_id: BigInt(data.client_id),
                assigned_to: data.assigned_to != null ? BigInt(data.assigned_to) : null,
                title: data.title,
                description: data.description,
                status: (data.status ?? 'new') as ticket_status,         
                priority: (data.priority ?? 'medium') as ticket_priority, 
            },
        });
    }

    async updateTicket(id: number, data: UpdateTicketDto) {
        return this.prisma.tickets.update({
            where: { id: BigInt(id) },
            data: {
                ...(data.status && { status: data.status as ticket_status }),
                ...(data.assigned_to !== undefined && {
                    assigned_to: data.assigned_to === null ? null : BigInt(data.assigned_to),
                }),
            },
            include: {
                ticket_comments: true,
                users_tickets_client_idTousers: true,
                users_tickets_assigned_toTousers: true,
            },
        });
    }

    async addComment(ticketId: number, data: { author_id: number; body: string }) { return this.prisma.ticket_comments.create({ data: { ticket_id: BigInt(ticketId), author_id: BigInt(data.author_id), body: data.body, }, }); }


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
        console.warn('[CHAOS] returning CORRUPT payload for client', clientId);
        return [{
            id: '1',                         // string, nu number
            client_id: String(clientId),
            assigned_to: '3',
            title: 'Telefon nu se aprinde',
            description: 'fsgsdgsdgsdgsd',
            statuz: 'resolved',
            priority: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ticket_comments: [],
        }]; //ce se intampla daca schimb cheile 
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

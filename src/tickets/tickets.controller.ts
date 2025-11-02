import { Controller, Get, Param, ParseIntPipe, Post, Body, BadRequestException, Patch } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { error } from 'console';

@Controller('tickets')
export class TicketsController {
    constructor(private ticketsService: TicketsService) { }

    @Get()
    getAll() {
        return this.ticketsService.findAll();
    }

    @Get('client/:id')
    findByClient(@Param('id') id: string) {
        return this.ticketsService.findByClient(Number(id));
        //throw new Error('Test error');
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ticketsService.findOne(Number(id));
    }


    @Get('technician/:id')
    findByTechnician(@Param('id') id: string) {
        return this.ticketsService.findByTechnician(Number(id));
    }

    @Post()
    async create(@Body() body: any) {
        // validare ultra-minimală ca să nu crape
        if (!body?.client_id || !body?.title || !body?.description) {
            throw new BadRequestException('client_id, title și description sunt obligatorii');
        }
        return this.ticketsService.create({
            client_id: Number(body.client_id),
            assigned_to: body.assigned_to != null ? Number(body.assigned_to) : null,
            title: String(body.title),
            description: String(body.description),
            status: body.status,       // opțional
            priority: body.priority,   // opțional
        });
    }

    @Post(':id/comments')
    addComment(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { author_id: number; body: string },
    ) {
        return this.ticketsService.addComment(id, {
            author_id: Number(body.author_id),
            body: String(body.body),
        });
    }

    @Patch(':id')
    updateTicket(
        @Param('id') id: string,
        @Body() data: { status?: string; assigned_to?: number },
    ) {
        return this.ticketsService.updateTicket(+id, data);
    }
}

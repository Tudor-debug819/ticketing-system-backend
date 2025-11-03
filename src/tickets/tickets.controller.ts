import { Controller, Get, Param, ParseIntPipe, Post, Body, BadRequestException, Patch } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { error } from 'console';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Controller('tickets')
export class TicketsController {
    constructor(private ticketsService: TicketsService) { }

    @Get()
    getAll() {
        return this.ticketsService.findAll();
    }

    @Get('client/:id')
    findByClient(@Param('id', ParseIntPipe) id: string) {
        return this.ticketsService.findByClient(Number(id));
        //throw new Error('Test error');
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: string) {
        return this.ticketsService.findOne(Number(id));
    }


    @Get('technician/:id')
    findByTechnician(@Param('id', ParseIntPipe) id: string) {
        return this.ticketsService.findByTechnician(Number(id));
    }

    @Post()
    create(@Body() dto: CreateTicketDto) {
        return this.ticketsService.create(dto);
    }

    @Post(':id/comments') addComment(@Param('id', ParseIntPipe) id: number, @Body() body: { author_id: number; body: string },) { return this.ticketsService.addComment(id, { author_id: Number(body.author_id), body: String(body.body), }); }

    @Patch(':id')
    updateTicket(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateTicketDto,
    ) {
        return this.ticketsService.updateTicket(id, dto);
    }
}

import { IsIn, IsInt, IsOptional, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTicketDto {
    @IsOptional()
    @IsIn(['new', 'open', 'in_progress', 'on_hold', 'resolved', 'closed'])
    status?: string;

    @IsOptional()
    @ValidateIf((_, v) => v !== null)
    @Type(() => Number) @IsInt()
    assigned_to?: number | null;
}
import { IsIn, IsInt, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTicketDto {
    @Type(() => Number) @IsInt()
    client_id!: number;

    @IsString() @MinLength(3)
    title!: string;

    @IsString() @MinLength(3)
    description!: string;

    @IsOptional()
    @ValidateIf((_, v) => v !== null)
    @Type(() => Number) @IsInt()
    assigned_to?: number | null;

    @IsOptional()
    @IsIn(['new', 'open', 'in_progress', 'on_hold', 'resolved', 'closed'])
    status?: string;

    @IsOptional()
    @IsIn(['low', 'medium', 'high', 'urgent'])
    priority?: string;
}
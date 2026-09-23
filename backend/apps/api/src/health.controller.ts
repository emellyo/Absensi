import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Status service' })
  check() {
    return { status: 'ok', service: 'api', timestamp: new Date().toISOString() };
  }
}

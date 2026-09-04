import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class AppController {
  @Get('health')
  @ApiOperation({ summary: 'Health check', description: 'Returns service health status, current timestamp, and uptime in seconds. Used for liveness/readiness probes.' })
  @ApiResponse({ status: 200, description: 'Service is healthy.' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}

import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all users (admin)' })
  getUsers() {
    return { message: 'TODO: implement admin list users' };
  }

  @Get('docs/queue')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get document verification queue' })
  getDocQueue() {
    return { message: 'TODO: implement doc queue' };
  }

  @Patch('docs/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve/reject document' })
  verifyDoc(@Param('id') id: string) {
    return { message: `TODO: implement verify doc ${id}` };
  }

  @Get('disputes')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get open disputes' })
  getDisputes() {
    return { message: 'TODO: implement get disputes' };
  }

  @Patch('disputes/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Resolve a dispute' })
  resolveDispute(@Param('id') id: string) {
    return { message: `TODO: implement resolve dispute ${id}` };
  }

  @Get('stats')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get platform stats' })
  getStats() {
    return { message: 'TODO: implement admin stats' };
  }
}

import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { VerifyDocDto } from './dto/verify-doc.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';

@ApiTags('admin')
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ─── User Management ────────────────────────────────────────────

  @Get('users')
  @ApiOperation({ summary: 'List all users with filters' })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'role', required: false })
  @ApiQuery({ name: 'status', required: false })
  getUsers(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.listUsers({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
      search,
      role,
      status,
    });
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user details (admin)' })
  getUserDetails(@Param('id') id: string) {
    return this.adminService.getUserDetails(id);
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Update user status (suspend/activate)' })
  updateUserStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.adminService.updateUserStatus(id, status);
  }

  // ─── Document Verification ──────────────────────────────────────

  @Get('docs/queue')
  @ApiOperation({ summary: 'Get document verification queue' })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  getDocQueue(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.adminService.getDocQueue({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
    });
  }

  @Patch('docs/:id')
  @ApiOperation({ summary: 'Approve or reject a document' })
  verifyDoc(@Param('id') id: string, @Body() dto: VerifyDocDto) {
    return this.adminService.verifyDocument(id, dto);
  }

  // ─── Disputes ───────────────────────────────────────────────────

  @Get('disputes')
  @ApiOperation({ summary: 'Get open disputes' })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'status', required: false })
  getDisputes(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getDisputes({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
      status,
    });
  }

  @Patch('disputes/:id')
  @ApiOperation({ summary: 'Resolve a dispute' })
  resolveDispute(@Param('id') id: string, @Body() dto: ResolveDisputeDto) {
    return this.adminService.resolveDispute(id, dto);
  }

  // ─── Stats ──────────────────────────────────────────────────────

  @Get('stats')
  @ApiOperation({ summary: 'Get platform statistics' })
  getStats() {
    return this.adminService.getStats();
  }
}

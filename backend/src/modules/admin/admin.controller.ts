import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { S3Service } from '../kyc/s3.service';
import { VerifyDocDto } from './dto/verify-doc.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';

@ApiTags('admin')
@Controller('admin')
@UseGuards(RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly s3Service: S3Service,
  ) {}

  // ─── User Management ────────────────────────────────────────────

  @Get('users')
  @ApiOperation({
    summary: 'List all users with filters',
    description: 'Returns a paginated list of users with optional filtering by search term, role, and status. Admin only.',
  })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'role', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({ status: 200, description: 'Paginated user list returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Admin role required.' })
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
  @ApiOperation({
    summary: 'Get user details (admin)',
    description: 'Retrieves the full profile of any user by ID including KYC status and activity logs. Admin only.',
  })
  @ApiResponse({ status: 200, description: 'User details returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Admin role required.' })
  @ApiResponse({ status: 404, description: 'User not found with the provided ID.' })
  getUserDetails(@Param('id') id: string) {
    return this.adminService.getUserDetails(id);
  }

  @Patch('users/:id/status')
  @ApiOperation({
    summary: 'Update user status (suspend/activate)',
    description: 'Changes a user account status to active, suspended, or banned. Admin only.',
  })
  @ApiResponse({ status: 200, description: 'User status updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid status value provided.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Admin role required.' })
  @ApiResponse({ status: 404, description: 'User not found with the provided ID.' })
  updateUserStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.adminService.updateUserStatus(id, status);
  }

  // ─── Document Verification ──────────────────────────────────────

  @Get('docs/queue')
  @ApiOperation({
    summary: 'Get document verification queue',
    description: 'Returns a paginated list of pending KYC documents awaiting verification. Admin only.',
  })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiResponse({ status: 200, description: 'Document queue returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Admin role required.' })
  getDocQueue(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.adminService.getDocQueue({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
    });
  }

  @Patch('docs/:id')
  @ApiOperation({
    summary: 'Approve or reject a document',
    description: 'Approves or rejects a KYC document submission with optional rejection reason. Admin only.',
  })
  @ApiResponse({ status: 200, description: 'Document status updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid verification status provided.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Admin role required.' })
  @ApiResponse({ status: 404, description: 'Document not found with the provided ID.' })
  verifyDoc(@Param('id') id: string, @Body() dto: VerifyDocDto) {
    return this.adminService.verifyDocument(id, dto);
  }

  @Get('docs/:id/url')
  @ApiOperation({
    summary: 'Get presigned URL for document preview',
    description: 'Returns a temporary presigned URL to view/download a KYC document. Admin only.',
  })
  @ApiResponse({ status: 200, description: 'Presigned URL returned.' })
  @ApiResponse({ status: 404, description: 'Document not found.' })
  async getDocUrl(@Param('id') id: string) {
    const doc = await this.adminService.getDocumentById(id);
    const url = await this.s3Service.getPresignedUrl(doc.s3Key, 3600);
    return { url, expiresIn: 3600 };
  }

  // ─── Disputes ───────────────────────────────────────────────────

  @Get('disputes')
  @ApiOperation({
    summary: 'Get open disputes',
    description: 'Returns a paginated list of ride disputes with optional status filtering. Admin only.',
  })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({ status: 200, description: 'Dispute list returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Admin role required.' })
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
  @ApiOperation({
    summary: 'Resolve a dispute',
    description: 'Resolves a ride dispute with a resolution note and refund if applicable. Admin only.',
  })
  @ApiResponse({ status: 200, description: 'Dispute resolved successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid resolution data provided.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Admin role required.' })
  @ApiResponse({ status: 404, description: 'Dispute not found with the provided ID.' })
  resolveDispute(@Param('id') id: string, @Body() dto: ResolveDisputeDto) {
    return this.adminService.resolveDispute(id, dto);
  }

  // ─── Stats ──────────────────────────────────────────────────────

  @Get('stats')
  @ApiOperation({
    summary: 'Get platform statistics',
    description: 'Returns aggregated platform metrics including total users, rides, revenue, and active drivers. Admin only.',
  })
  @ApiResponse({ status: 200, description: 'Platform statistics returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Admin role required.' })
  getStats() {
    return this.adminService.getStats();
  }
}

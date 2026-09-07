import { Controller, Get, Patch, Post, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtUser } from '../../common/decorators/current-user.decorator';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get notifications', description: 'Returns all notifications for the authenticated user, sorted by most recent. Includes ride alerts, payment updates, and system messages.' })
  @ApiResponse({ status: 200, description: 'Notifications returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized – valid JWT token required.' })
  async findAll(@CurrentUser() user: JwtUser) {
    return this.notificationService.findAllByUser(user.userId);
  }

  @Patch(':id/read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark notification as read', description: 'Marks a single notification as read. Returns success status.' })
  @ApiResponse({ status: 200, description: 'Notification marked as read.' })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  async markRead(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    await this.notificationService.markRead(id, user.userId);
    return { success: true };
  }

  @Post('read-all')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark all as read', description: 'Marks every unread notification for the authenticated user as read in a single operation.' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read.' })
  @ApiResponse({ status: 401, description: 'Unauthorized – valid JWT token required.' })
  async markAllRead(@CurrentUser() user: JwtUser) {
    await this.notificationService.markAllRead(user.userId);
    return { success: true };
  }
}

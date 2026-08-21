import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

interface AuthenticatedSocket extends Socket {
  data: {
    user?: { sub: string; phone: string; role: string };
  };
  handshake: Socket['handshake'] & {
    auth?: { token?: string };
  };
}

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<AuthenticatedSocket>();
    const token = client.handshake?.auth?.token;

    if (!token) {
      throw new WsException('Unauthorized');
    }

    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        phone: string;
        role: string;
      }>(token);
      client.data.user = payload;
      return true;
    } catch {
      throw new WsException('Unauthorized');
    }
  }
}

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  ADMIN_ROOM,
  EmployeeUpdatedNotification,
  EVENT_EMPLOYEE_UPDATED,
  NOTIFICATIONS_NAMESPACE,
  Role,
} from '@app/contracts';
import { Server, Socket } from 'socket.io';
import { JwtPayload } from '../common/auth.types.js';

@WebSocketGateway({
  namespace: NOTIFICATIONS_NAMESPACE,
  cors: { origin: true, credentials: true },
})
export class NotificationsGateway implements OnGatewayConnection {
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    const token =
      (client.handshake.auth?.token as string | undefined) ??
      (client.handshake.query?.token as string | undefined);

    if (!token) {
      client.disconnect(true);
      return;
    }

    try {
      const payload = await this.jwt.verifyAsync<JwtPayload>(token, {
        secret: this.config.getOrThrow<string>('JWT_SECRET'),
      });

      // Hanya admin HRD yang boleh menerima notifikasi perubahan data.
      if (payload.role !== Role.ADMIN) {
        client.disconnect(true);
        return;
      }

      await client.join(ADMIN_ROOM);
      this.logger.log(`Admin terhubung ke notifikasi: ${payload.email}`);
    } catch {
      client.disconnect(true);
    }
  }

  notifyAdmins(notification: EmployeeUpdatedNotification): void {
    this.server.to(ADMIN_ROOM).emit(EVENT_EMPLOYEE_UPDATED, notification);
  }
}

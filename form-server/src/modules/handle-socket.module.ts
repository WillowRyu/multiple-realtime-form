import { HandleSocketGateway } from './handle-socket-gateway';
import { Module } from '@nestjs/common';

@Module({
  providers: [HandleSocketGateway],
})
export class HandleSocketModule {}

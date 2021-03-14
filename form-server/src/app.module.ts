import { HandleSocketModule } from './modules/handle-socket.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [HandleSocketModule],
})
export class AppModule {}

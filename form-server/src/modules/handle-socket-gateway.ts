import { EventType } from './handle-socket.model';
import { BlockContent } from './handle-socket.model';
import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

const GENESIS_BLOCK = 'genesis-block';

@WebSocketGateway()
export class HandleSocketGateway {
  /**
   * DB
   */
  connectedClients: string[] = [];
  blockDatas: BlockContent[] = [
    {
      id: GENESIS_BLOCK,
      content: '',
    },
  ];

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('SocketGateWay');

  handleConnection(client: Socket) {
    this.connectedClients = [...this.connectedClients, client.id];
    this.logger.log(
      `Client Connected: ${client.id} - ${this.connectedClients.length} connected clients.`,
    );
    this.server.emit(EventType.ClientConnected, this.connectedClients);
    client.emit(EventType.Data, this.blockDatas);
  }

  handleDisconnect(client: Socket) {
    this.connectedClients = this.connectedClients.filter(
      (c: string) => c !== client.id,
    );
    this.logger.log(
      `Client DisConnected: ${client.id} - ${this.connectedClients.length} connected clients.`,
    );
    this.server.emit(EventType.ClientConnected, this.connectedClients);
  }

  @SubscribeMessage(EventType.CreateBlock)
  createBlock(client: Socket, payload: BlockContent) {
    this.blockDatas.push(payload);
    this.logger.log(`create block: ${payload.id}`);
    client.broadcast.emit(EventType.SyncValue, this.blockDatas);
  }

  @SubscribeMessage(EventType.DeleteBlock)
  deleteBlock(client: Socket, payload: BlockContent) {
    this.blockDatas = this.blockDatas.filter((v) => {
      if (v.id === GENESIS_BLOCK && payload.id === GENESIS_BLOCK) {
        v.content = '';
        return true;
      }
      return v.id !== payload.id;
    });
    this.logger.log(`delete block: ${payload.id}`);
    client.broadcast.emit(EventType.SyncValue, this.blockDatas);
  }

  @SubscribeMessage(EventType.PatchValue)
  patchValue(client: Socket, payload: BlockContent) {
    this.blockDatas = this.blockDatas.map((v) => {
      if (v.id === payload.id) v.content = payload.content;
      return v;
    });
    this.logger.log(`patch value: ${payload.id}`);
    client.broadcast.emit(EventType.SyncValue, this.blockDatas);
  }
}

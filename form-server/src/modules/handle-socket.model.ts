export enum EventType {
  Data = '[Socket] Data',
  ClientConnected = '[Socket] Client Connected',
  SyncValue = '[Socket] Sync Value',
  PatchValue = '[Patch] Patch Value',
  CreateBlock = '[Patch] Create Block',
  DeleteBlock = '[Patch] Delete Block',
  Init = '[Init] Initial Data',
}

export interface BlockContent {
  id: string;
  content: string;
}

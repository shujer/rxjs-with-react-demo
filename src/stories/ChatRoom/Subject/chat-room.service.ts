import { Subject } from "rxjs";
import { scan } from "rxjs/operators";

export interface MessageItem {
  userId: string;
  name: string;
  msg: string;
  timestamp: number;
}
class ChatRoomService {
  private messageSource$ = new Subject<MessageItem>();
  message$ = this.messageSource$.pipe(
    scan((acc, cur) => [...acc, cur], [] as MessageItem[])
  );
  send(msg: MessageItem) {
    this.messageSource$.next(msg);
  }
}

export default ChatRoomService;

import { Subject } from "rxjs";
import { publishReplay, refCount, scan } from "rxjs/operators";

export interface MessageItem {
  userId: string;
  name: string;
  msg: string;
  timestamp: number;
}
/**
 * 加热
 */
class ChatRoomService {
  private messageSource$ = new Subject<MessageItem>();
  message$ = this.messageSource$.pipe(
    scan((acc, cur) => [...acc, cur], [] as MessageItem[]),
    publishReplay(),
    refCount()
  );
  send(msg: MessageItem) {
    this.messageSource$.next(msg);
  }
}

export default ChatRoomService;

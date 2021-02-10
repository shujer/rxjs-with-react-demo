import { ReplaySubject } from "rxjs";
import { scan } from "rxjs/operators";

export interface MessageItem {
  userId: string;
  name: string;
  msg: string;
  timestamp: number;
}
/**
 * 重播全部
 */
class ChatRoomService {
  private messageSource$ = new ReplaySubject<MessageItem>();
  message$ = this.messageSource$.pipe(
    scan((acc, cur) => [...acc, cur], [] as MessageItem[])
  );
  send(msg: MessageItem) {
    this.messageSource$.next(msg);
  }
}

export default ChatRoomService;

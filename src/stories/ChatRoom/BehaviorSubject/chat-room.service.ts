import { BehaviorSubject } from "rxjs";
import { filter, scan } from "rxjs/operators";

export interface MessageItem {
  userId: string;
  name: string;
  msg: string;
  timestamp: number;
}
/**
 * 重播最近一个值
 */
class ChatRoomService {
  private messageSource$ = new BehaviorSubject<MessageItem | undefined>(
    undefined
  );
  message$ = this.messageSource$.pipe(
    filter((msg) => !!msg),
    scan((acc, cur) => [...acc, cur!], [] as MessageItem[])
  );
  send(msg: MessageItem) {
    this.messageSource$.next(msg);
  }
}

export default ChatRoomService;

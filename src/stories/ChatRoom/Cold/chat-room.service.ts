import { Subject } from "rxjs";
import { scan } from "rxjs/operators";

export interface MessageItem {
  userId: string;
  name: string;
  msg: string;
  timestamp: number;
}
/**
 * 每个普通的 Observables 实例都只能被一个观察者订阅，
 * 当它被其他观察者订阅的时候会产生一个新的实例
 */
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

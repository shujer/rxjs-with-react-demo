import { BehaviorSubject } from "rxjs";

class ShareService {
  private toggleSouce$ = new BehaviorSubject<boolean>(false);
  toggle$ = this.toggleSouce$.asObservable();
  toggle() {
    this.toggleSouce$.next(!this.toggleSouce$.getValue());
  }
}

export default ShareService;

import { BehaviorSubject, combineLatest, from } from "rxjs";
import { concatMap, tap } from "rxjs/operators";

export interface TodoItem {
  id: number;
  name: string;
  done: boolean;
}
let count = 0;
const requestList = (limit: number = 10): Promise<TodoItem[]> => {
  console.log("request", count++, new Date().getTime());
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        Array(limit)
          .fill(0)
          .map((ele, i) => ({
            id: i,
            name: `todo-${i}`,
            done: Math.random() > 0.5 ? true : false,
          }))
      );
    }, 2000);
  });
};

class TodoService {
  private action$ = new BehaviorSubject<
    { type: string; playload: any } | undefined
  >(undefined);
  private page$ = new BehaviorSubject<{ limit: number; offset: number }>({
    limit: 10,
    offset: 0,
  });
  private refresh$ = new BehaviorSubject<number>(0);
  private loadingSource$ = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSource$.asObservable();
  public todoList$ = combineLatest(
    this.page$,
    this.action$,
    this.refresh$
  ).pipe(
    tap(() => {
      this.loadingSource$.next(true);
    }),
    concatMap(([page]) => {
      return from(requestList(page.limit));
    }),
    tap((res) => {
      this.loadingSource$.next(false);
    })
  );

  search(params: { type: string; playload: any }) {
    this.action$.next(params);
  }
  change(params: { limit: number; offset: number }) {
    this.page$.next(params);
  }
  refresh() {
    this.refresh$.next(Math.random());
  }
}

export default TodoService;

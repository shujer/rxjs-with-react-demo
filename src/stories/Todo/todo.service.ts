import { BehaviorSubject, combineLatest, from } from "rxjs";
import { filter, map, scan, switchMap, tap } from "rxjs/operators";

export interface TodoItem {
  id: number;
  name: string;
  done: boolean;
}

const requestList = (limit: number = 10): Promise<TodoItem[]> => {
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
    }, 1000);
  });
};

class TodoService {
  private search$ = new BehaviorSubject<{ [x: string]: any }>({});
  private page$ = new BehaviorSubject<{ limit: number; offset: number }>({
    limit: 10,
    offset: 0,
  });
  private refresh$ = new BehaviorSubject<number>(0);
  private loadingSource$ = new BehaviorSubject<number>(0);
  public loading$ = this.loadingSource$.pipe(
    scan((acc, cur) => acc + cur, 0),
    map((count) => !!count)
  );
  public todoList$ = combineLatest(
    this.search$,
    this.page$,
    this.refresh$
  ).pipe(
    filter(([action]) => !!action),
    tap(() => {
      this.loadingSource$.next(-1);
    }),
    switchMap(([search, page, refresh]) => {
      return from(requestList(page.limit));
    }),
    tap(() => {
      this.loadingSource$.next(1);
    })
  );

  search(params: { [x: string]: any }) {
    this.search$.next(params);
  }
  change(params: { limit: number; offset: number }) {
    this.page$.next(params);
  }
  refresh() {
    this.refresh$.next(Math.random());
  }
}

export default TodoService;

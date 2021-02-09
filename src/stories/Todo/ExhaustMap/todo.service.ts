import { BehaviorSubject, combineLatest, from, of } from "rxjs";
import { exhaustMap, delay, filter, scan, tap } from "rxjs/operators";

export interface TodoItem {
  id: number;
  name: string;
  done: boolean;
}

const createTodoList = (len: number) => {
  return Array(len)
    .fill(0)
    .map((_, i) => ({
      id: i,
      name: `todo-${i}`,
      done: Math.random() > 0.5 ? true : false,
    }));
};

const toggleItem = (list: TodoItem[], id: number) => {
  let index = list.findIndex((item) => item.id === id);
  if (index > -1) {
    return [
      ...list.slice(0, index),
      { ...list[index], done: !list[index].done },
      ...list.slice(index + 1),
    ];
  }
  return list;
};

let count = 0;
const requestList = (limit: number = 10): Promise<TodoItem[]> => {
  console.log("request", count++, new Date().getTime());
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(createTodoList(limit));
    }, 1500);
  });
};

class TodoService {
  private action$ = new BehaviorSubject<{ type: string; playload?: any }>({
    type: "init",
    playload: [],
  });
  private page$ = new BehaviorSubject<{ limit: number; offset: number }>({
    limit: 10,
    offset: 0,
  });
  private refresh$ = new BehaviorSubject<number>(0);
  private loadingSource$ = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSource$.asObservable();

  todoListRes$ = combineLatest(this.page$, this.refresh$)
    .pipe(
      tap(() => {
        this.loadingSource$.next(true);
      }),
      exhaustMap(([page]) => {
        return from(requestList(page.limit));
      }),
      tap((list) => {
        this.action$.next({ type: "init", playload: list });
        this.loadingSource$.next(false);
      })
    )
    .subscribe();

  todoList$ = this.action$.pipe(
    filter((action) => !!action?.type),
    exhaustMap((action) => of(action).pipe(delay(2000))),
    scan((list, action) => {
      switch (action.type) {
        case "toggle": {
          return toggleItem(list, action.playload?.id);
        }
        case "init":
          return action.playload;
        default:
          return list;
      }
    }, [] as TodoItem[])
  );

  toggle(id: number) {
    this.action$.next({ type: "toggle", playload: { id } });
  }
  change(params: { limit: number; offset: number }) {
    this.page$.next(params);
  }
  refresh() {
    this.refresh$.next(Math.random());
  }
}

export default TodoService;

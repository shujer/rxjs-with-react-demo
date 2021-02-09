import { BehaviorSubject, combineLatest, from } from "rxjs";
import { switchMap, tap } from "rxjs/operators";

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

const requestList = (limit: number = 10): Promise<TodoItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(createTodoList(limit));
    }, 2000);
  });
};

class TodoService {
  private refresh$ = new BehaviorSubject<number>(0);
  private loadingSource$ = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSource$.asObservable();
  public todoList$ = combineLatest(this.refresh$).pipe(
    tap(() => {
      this.loadingSource$.next(true);
    }),
    switchMap(() => {
      return from(requestList());
    }),
    tap((res) => {
      this.loadingSource$.next(false);
    })
  );

  refresh() {
    this.refresh$.next(Math.random());
  }
}

export default TodoService;

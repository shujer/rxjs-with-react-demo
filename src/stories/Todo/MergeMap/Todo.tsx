import React from "react";
import cx from "classnames";
import { useObservable } from "rxjs-hooks";
import TodoService from "./todo.service";
import { useInstance } from "../../utils/useInstance";
import styles from "../todo.module.css";

export interface TodoProps {}

export const Todo: React.FC<TodoProps> = () => {
  const todoService = useInstance(TodoService);
  const todoList = useObservable(() => todoService.todoList$, []);
  const loading = useObservable(() => todoService.loading$, false);
  return (
    <div className={styles.container}>
      <button className={styles.btn} onClick={() => todoService.refresh()}>
        refresh
      </button>
      <div className={styles.todolist}>
        {todoList.map((todo) => (
          <div className={styles.todoitem} key={todo.id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => todoService.toggle(todo.id)}
            ></input>
            <span>{todo.name}</span>
          </div>
        ))}
        <div className={cx({ [styles.loading]: loading })}></div>
      </div>
    </div>
  );
};

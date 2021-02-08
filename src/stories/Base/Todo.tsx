import React from "react";
import { useObservable } from "rxjs-hooks";
import cx from "classnames";
import { useInstance } from "../utils/useInstance";
import TodoService from "./todo.service";
import styles from "../todo.module.css";

export interface TodoProps {}

export const Todo: React.FC<TodoProps> = () => {
  const todoService = useInstance(TodoService);
  const todoList = useObservable(() => todoService.todoList$, []);
  const loading = useObservable(() => todoService.loading$, false);
  return (
    <div className={styles.container}>
      <div className={styles.todolist}>
        {todoList.map((todo) => (
          <div className={styles.todoitem} key={todo.id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => {}}
            ></input>
            <span>{todo.name}</span>
          </div>
        ))}
        <div className={cx({ [styles.loading]: loading })}></div>
      </div>
    </div>
  );
};

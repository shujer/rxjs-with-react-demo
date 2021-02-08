import React from "react";
import { useObservable } from "rxjs-hooks";
import TodoService from "./todo.service";
import styles from "./todo.module.css";
import cx from "classnames";
import { useInstance } from "../utils/useInstance";

export interface TodoProps {}

export const Todo: React.FC<TodoProps> = () => {
  const todoService = useInstance(TodoService);
  const todoList = useObservable(() => todoService.todoList$, []);
  const loading = useObservable(() => todoService.loading$, false);
  return (
    <div className={styles.container}>
      {todoList.map((todo) => (
        <div key={todo.id}>
          <input type="checkbox" checked={todo.done}></input>
          <span>{todo.name}</span>
        </div>
      ))}
      <div className={cx({ [styles.loading]: loading })}></div>
    </div>
  );
};

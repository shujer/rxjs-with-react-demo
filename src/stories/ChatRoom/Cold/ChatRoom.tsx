import React, { useRef, useState } from "react";

import { useObservable } from "rxjs-hooks";
import { InjectorContext, useInject, useInjector } from "../../utils/useInject";

import ChatRoomService from "./chat-room.service";
import styles from "../chat-room.module.css";
import cx from "classnames";

export interface Room {
  userId: string;
  name: string;
  status: "open" | "close";
}

const defaultRooms: Room[] = [
  {
    userId: "susie",
    name: "Susie",
    status: "open",
  },
  {
    userId: "jane",
    name: "Jane",
    status: "close",
  },
  {
    userId: "danie",
    name: "Danie",
    status: "close",
  },
];

const ChatRoom: React.FC<Room> = (props) => {
  const chatroomService = useInject(ChatRoomService);
  const messages = useObservable(() => chatroomService.message$, []);
  const inputRef = useRef<HTMLInputElement>(null);
  const send = () => {
    const value = inputRef.current?.value;
    if (value) {
      chatroomService.send({
        userId: props.userId,
        name: props.name,
        msg: value,
        timestamp: new Date().getTime(),
      });
      inputRef.current!.value = "";
    }
  };
  return (
    <div className={styles.room}>
      <div className={styles.messageList}>
        {messages.map((msg) => (
          <div
            className={cx([
              styles.msgBox,
              msg.userId === props.userId && styles.reverse,
            ])}
          >
            <div className={styles.avator}>{msg.name}</div>
            <div className={styles.msg}>{msg.msg}</div>
          </div>
        ))}
      </div>
      <div className={styles.inputGroup}>
        <input className={styles.input} ref={inputRef}></input>
        <button className={cx(styles.btn, styles.submitBtn)} onClick={send}>
          提交
        </button>
      </div>
    </div>
  );
};

export const ChatRooms = () => {
  const [rooms, setRooms] = useState<Room[]>(defaultRooms);
  const injector = useInjector([ChatRoomService]);
  const toggle = (id: string, status: "open" | "close") => {
    setRooms((rooms) => {
      let index = rooms.findIndex((room) => room.userId === id);
      if (index >= 0) {
        return [
          ...rooms.slice(0, index),
          { ...rooms[index], status },
          ...rooms.slice(index + 1),
        ];
      } else {
        return rooms;
      }
    });
  };
  return (
    <InjectorContext.Provider value={injector}>
      <div className={styles.container}>
        {rooms.map((room) => (
          <div className={styles.item} key={room.userId}>
            <div className={styles.title}>{room.name}</div>
            {room.status === "open" ? (
              <ChatRoom {...room} key={room.userId}></ChatRoom>
            ) : (
              <div className={styles.empty}></div>
            )}
            {room.status === "open" && (
              <button
                className={cx([styles.btn, styles.close])}
                onClick={() => toggle(room.userId, "close")}
              >
                Exit
              </button>
            )}
            {room.status === "close" && (
              <button
                className={cx([styles.btn, styles.open])}
                onClick={() => toggle(room.userId, "open")}
              >
                Enter
              </button>
            )}
          </div>
        ))}
      </div>
    </InjectorContext.Provider>
  );
};

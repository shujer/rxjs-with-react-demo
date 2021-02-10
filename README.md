---
# 主题列表：juejin, github, smartblue, cyanosis, channing-cyan, fancy, hydrogen, condensed-night-purple, greenwillow, v-green, vue-pro, healer-readable, mk-cute, jzman, geek-black, awesome-green, qklhk-chocolate
# 贡献主题：https://github.com/xitu/juejin-markdown-themes
theme: cyanosis
highlight: github
---

![debounceTime](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f128ba8adaf4ab2a31fad59a2dc62a7~tplv-k3u1fbpfcp-watermark.image)

## 引言

学习和使用 Rxjs 也有一段时间了，一直想找个时间总结下一些使用技巧。网上关于 Rxjs 的文章并不多，很多是围绕官方文档的操作符使用和基本原理展开，对于刚接触的小白来说，有时候会看得一团雾水。

怎样快速上手一个新的框架或者类库——当然是先从一个 Demo 入手，先**会用**再去理解背后的原理和思想。

本文主要结合 Rxjs v6 在 React v16 中的使用，从实例出发，由浅入深地谈谈对 Rxjs 的理解。

## 起手式

### 订阅数据流

在 React 组件中使用 Rxjs，最简单的用法就是：在组件初始挂载的时候，**订阅一个数据流**；在组件卸载的时候，**取消订阅这个数据流**。

- 订阅事件流

```jsx
import { fromEvent } from "rxjs";

const Component = () => {
  useEffect(() => {
    let subscription = fromEvent(document.body, "click").subscribe((e) => {
      console.log("click", e);
    });
    return () => subscription.unsubscribe();
  }, []);
  return <div></div>;
};
```

- 订阅计数流
  这里我们使用 [rxjs-hooks](https://github.com/LeetCode-OpenSource/rxjs-hooks) 提供的 `useObservable` 订阅数据流，其实就是将前面的 `subscribe` 和 `unsubscribe` 封装使用。

```jsx
const Counter = () => {
  const numbers$ = useMemo(() => interval(1000), []);
  const count = useObservable(() => numbers$);
  return <div>{count}</div>;
};
```

### 分层架构

在开发中，我们通常会将业务组件的视图和应用逻辑进行分离，以保证组件的精简和纯净，同时便于复用逻辑层。

Angular 通过依赖注入来帮你更容易地将应用逻辑分解为服务，并让这些服务可用于各个组件中。我们可以利用这个思想，将 Rxjs 的操作单独抽离成一个 Service 层，在组件中通过注册使用这些服务。

![injector-injects](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80fe07479b9c4825a7e3978fb612e917~tplv-k3u1fbpfcp-zoom-1.image)

我们通过一个 TodoList 来分解这个过程。

- 定义一个 TodoService

```ts
// todo/model/service.js
class TodoService {
  // 用 $ 标记一个 Observable
  private refresh$ = new BehaviorSubject(0);
  private loadingSource$ = new BehaviorSubject(false);
  loading$ = this.loadingSource$.asObservable();
  todoList$ = combineLatest(this.refresh$).pipe(
    debounceTime(250),
    tap(() => {
      this.loadingSource$.next(true);
    }),
    switchMap(() => {
      return from(TodoApi.requestList());
    }),
    tap((res) => {
      this.loadingSource$.next(false);
    })
  );

  refresh() {
    this.refresh$.next(Math.random());
  }
}
```

- 在组件中使用 Service
  我们可以通过一个简单的 `useInstance`，在组件的整个生命周期内使用这个 Service 的单例。

```js
const useInstance = (instanceClass) => {
  const instance = useRef(null);
  return instance.current || (instance.current = new instanceClass());
};
```

```jsx
const Todo = (props) => {
  const todoService = useInstance(TodoService);
  return <div>...</div>;
};
```

- 订阅数据流

```jsx
// todo/index.jsx
export const Todo = () => {
  const todoService = useInstance(TodoService);
  const todoList = useObservable(() => todoService.todoList$, []);
  const loading = useObservable(() => todoService.loading$, false);
  return (
    <div>
      <div>
        {todoList.map((todo) => (
          <div key={todo.id}>
            <input type="checkbox" checked={todo.done}></input>
            <span>{todo.name}</span>
          </div>
        ))}
        <div className={cx({ [styles.loading]: loading })}></div>
      </div>
    </div>
  );
};
```

### 数据流管理

在上述的例子中，我们在单个组件中使用 `useInstance` 来注册数据源，但是，如果需要在多个组件中共享数据源呢？我们可以基于 Context 甚至 Redux 进行管理。

- 定义 Context

```js
const InjectorContext = createContext({ getInstance: () => null });
```

- 使用 Map 管理多个 Service

```js
const useInjector = (classes) => {
  const instanceMap = useInstance(Map);
  useEffect(() => {
    classes.forEach((cls) => {
      if (!instanceMap.has(cls.name)) {
        instanceMap.set(cls.name, new cls());
      }
    });
  }, [classes, instanceMap]);

  const getInstance = useCallback(
    (cls) => {
      if (!instanceMap.has(cls.name)) {
        instanceMap.set(cls.name, new cls());
      }
      return instanceMap.get(cls.name);
    },
    [instanceMap]
  );
  return { getInstance };
};

const useInject = (injectClass) => {
  const instance = useRef();
  const Injector = useContext(InjectorContext);
  return (
    instance.current || (instance.current = Injector.getInstance(injectClass))
  );
};
```

- 在组件中共享 Service 实例

```jsx
const DataA = (props) => {
  const shareService = useInject(ShareService);
  return <div>...</div>;
};
const DataB = (props) => {
  const shareService = useInject(ShareService);
  return <div>...</div>;
};

const SourceApp = () => {
  const injector = useInjector([ShareService]);
  return (
    <InjectorContext.Provider value={injector}>
      <div>
        <DataA></DataA>
        <DataB></DataB>
      </div>
    </InjectorContext.Provider>
  );
};
```

### More

更复杂的情况是，如果两个服务之间需要互相引用，我们可以参考 [injection-js](https://www.npmjs.com/package/injection-js)、 [react-ioc](https://github.com/gnaeus/react-ioc) 进行处理，这里就不作深入研究了。

## 在案例中解读

使用一个新框架，应该从实际业务场景出发，看它是否能真正解决开发中的一些难点。毕竟 Rxjs 学习曲线比较陡峭，简单场景下其实有很多替代方案。

### 案例一：TodoList

本节结合一个 TodoList 体会 `switchMap`、`concatMap`、`exhaustMap`、`mergeMap` 如何优化我们的异步逻辑管理。

这几个操作符都有相同的一个效果，即将**一个高阶操作映射成一个可观测的值（比如异步请求的结果）**，但是接收与处理请求的时机不同。

#### switchMap

解读：每次只处理最近一次接收的请求，如果上个请求还没完成即发起下个请求，则未完成的请求将被抛弃。
![switchMap](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d87600ec0dec4053972b20072dbf63cb~tplv-k3u1fbpfcp-zoom-1.image)
示例：给每个操作增加 1500 ms 的延时，在多次点击之后，只有最后一次的请求被成功处理。

![switchMap](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6df2efa8ff754c41bc8d0de3b76816d9~tplv-k3u1fbpfcp-watermark.image)

#### concatMap

解读：每个请求被依次处理，当上个请求处理成功再发起下次请求。
![concatMap](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4fdf35788902405f8d4ddd4c33fb6af5~tplv-k3u1fbpfcp-watermark.image)
示例：给每个操作增加 1500 ms 的延时，在多次点击之后，请求结果每 1500ms emit 一次。
![concatMap](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9bcb29b5541148f4ad1a52fcc0ab7e07~tplv-k3u1fbpfcp-watermark.image)

#### mergeMap

解读：每个请求都被接收并执行，不做特殊处理。
![mergeMap](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9735280a3f5c47da9432eddb8efbff5d~tplv-k3u1fbpfcp-watermark.image)
示例：给每个操作增加 1500 ms 的延时，点击后立即执行无需等待。
![mergeMap](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7c3ddc77705481abcadffd07a2bb159~tplv-k3u1fbpfcp-watermark.image)

#### exhaustMap

解读：上个请求结束之后才能接收新的请求。
![exhaustMap](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c3d2943f1f748459bb78b386c310fb0~tplv-k3u1fbpfcp-watermark.image)
示例：给每个操作增加 1500 ms 的延时，在多次点击过程中，第一个请求还没结束，因此只有第一个请求生效。
![exhaustMap](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3804633bb3734953a629a36f2c08cfd0~tplv-k3u1fbpfcp-watermark.image)

### 案例二：运动的小球

本节通过一个 小球的 JS 动画案例来体会 Rxjs 在开发上带来的逻辑简化。
我们来看这样一个案例：一个小球能在一片围栏限定的正方形场地内运动，运动方向限定了`上|下|左|右`，小球运动到围栏边缘即终止。

#### 初步分析

这看起来很简单？我们只需要完成:

- 实现 `上|下|左|右`4 个方向上的命令函数
- 结合 `requestAnimationFrame`，每次步进 `step` 的长度，来显示运动轨迹
- 实现一个钩子函数，在每次步进之前判断下一步是否超出范围，超出则终止

```js
// 一个参考的实现
const XY = {
  UP: [0, -1],
  DOWN: [0, 1],
  LEFT: [-1, 0],
  RIGHT: [1, 0],
};
const position = { x: 0, y: 0 };
const isValid = (x, y) => x >= 0 && x <= MAX_LEN && y >= 0 && y <= MAX_LEN;
const run = (action) => {
  const factor = XY[action];
  let x = factor[0] * step + position.x;
  let y = factor[1] * step + position.y;
  if (!isValid(x, y)) {
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;
    position.x = x;
    position.y = y;
    requestAnimationFrame(() => run(action));
    return true;
  }
  return false;
};
```

#### 进一步分析

如果多个命令连续发出，小球应该怎样运动呢？
![掉帧](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af02368a999646fa89be8390899cd978~tplv-k3u1fbpfcp-watermark.image)

这里如果不做处理，几个命令的效果可能会叠加，造成掉帧或者失效，这当然不是我们想要的。其他几个方案：

- 阻塞：如果当前运动未停止，则禁止下一个命令的操作按钮
- 排队：连续发出命令，通过一个命令队列存储，当一个操作结束之后判断命令队列是否为空，不为空则取出下一个命令执行
- 竞争：连续发出命令，下一个命令会取消上一个命令

这里其实对应了很多异步请求的场景。在这种情况下，我们想象下代码会变成什么样子？—— 我们可能需要写额外的钩子函数、维护命令队列、结合发布订阅模式或者命令模式去处理不同的情况。

#### 使用操作符简化

结合上一节的知识，这里我们只需要简单改变一个操作符就能实现不同需求下想要的效果。

- 定义一个**鼠标点击流**
- 指定 **animationFrameScheduler** 作为任务调度
- 使用 **takeWhile**，当 run 函数返回 `false` 值时终止 **repeat**
- 使用 **filter** 过滤无效的命令

```js
import { animationFrameScheduler, fromEvent, of } from "rxjs";
import { concatMap, filter, repeat, takeWhile, map } from "rxjs/operators";

fromEvent(toolBarRef, "click").pipe(
  concatMap((event) =>
    of(event.target.dataset.action, animationFrameScheduler).pipe(
      filter((action) => !!action),
      map(run),
      repeat(),
      takeWhile((r) => r)
    )
  )
);
```

- 使用 **concatMap** 的效果如下：
  ![concatMap](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b1562100e4324511952dd9f96cd3330c~tplv-k3u1fbpfcp-watermark.image)
- 使用 **switchMap** 的效果如下：
  ![switchMap](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5679d9fc388943799a50373fbd21d89e~tplv-k3u1fbpfcp-watermark.image)

### 案例三：聊天室

在这一节，我们通过一个纯前端的简易聊天室来体会 Rxjs 中的 **“Cold Observable”** 和 **“Hot Observable”**，以及 `Subject` 和它的子类 `BehaviorSubject` 与 `ReplaySubject` 的区别。

- 一个普通的 Observable 对象是 “Cold” 的，也就是说，它的实例无法被多个对象共享。
- Subject（主体）是一个代理对象，它既是一个 Observable 可以被订阅，又是一个 observer 可以发送订阅。它的实例可以被多个对象共享，也就是说它是 “Hot” 的。

我们先定义一个 Service 用于管理传输的消息。
```js
class ChatRoomService {
  private messageSource$ = new Subject();
  // 作为 Observable
  message$ = this.messageSource$.pipe(
    scan((acc, cur) => [...acc, cur], [])
  );
  // 作为 Observer
  send(msg) {
    this.messageSource$.next(msg);
  }
}
```
#### Subject
Subject 只有被订阅的时候才能接收到数据，因此初始进入聊天室的时候，消息记录为空，类似实时聊天室。

#### BehaviorSubject
BehaviorSubject 是 Subject 的一个子类，它在有新的订阅时，会重播最近一个值。

#### ReplaySubject
BehaviorSubject 是 Subject 的一个子类，它在有新的订阅时，会重播全部值。
![ReplaySubject](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3b7bdbef3b640269170d7d7af4b4bd6~tplv-k3u1fbpfcp-watermark.image)
#### AsyncSubject
AsyncSubject 是 Subject 的一个子类，它在有新的订阅时，只有异步结果成功才会重播最近一个值。

### 案例四：多文件上传

## 深入原理

## 参考

- [服务与依赖注入](https://angular.cn/guide/architecture-services)
- [RxJS：给你如丝一般顺滑的编程体验](juejin.cn/post/6910943445569765384)

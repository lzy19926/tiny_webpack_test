

// 深只读对象(数组  对象)
export type DeepReadonly<T> = T extends (infer R)[]
  ? DeepReadonlyArray<R>
  : T extends Function
  ? T
  : T extends object
  ? DeepReadonlyObject<T>
  : T;

export type DeepReadonlyArray<T> = ReadonlyArray<DeepReadonly<T>>;

export type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};





// 定义Effects列表的键值对  值为函数
export type MapEffects<T> = {
  [P in keyof T]: T[P] extends (...args: infer U) => infer R ? (...args: U) => R : T;
};

export type SubscribeCallback<T> = (v: T) => void;




// 初始化状态接口
export interface InitState {
  [key: string]: any;
}


// 拦截器接口
export interface RekvDelegate<T, K> {
  beforeUpdate?: (e: { store: T; state: Readonly<K> }) => K | void;
  afterUpdate?: (e: { store: T; state: Readonly<K> }) => void;
}

export function isFunction(fn: any): fn is Function {
  return typeof fn === 'function';
}


// 判断是否是原始对象(未包装过的对象)
export function isPlainObject(obj: any): boolean {
  if (typeof obj !== 'object' || obj === null) return false;
  // 找到原型练最里层(Object原型对象)  如果传入对象的原型对象就是Object原型对象 那么就是原始对象
  //原始对象: 未经过包装的对象(比如vue的包装后的对象)
  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(obj) === proto;
}


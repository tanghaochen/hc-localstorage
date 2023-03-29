export default class ProxiedLocalStorage {
  constructor(key, initialData) {
    console.log("ProxiedLocalStorage init");
    if (!key || !initialData)
      throw new Error("key and initialData are required");
    this.key = key || "myObject";
    this.target = initialData || {};
    return this.init();
  }

  init() {
    if (!localStorage.getItem(this.key)) {
      localStorage.setItem(this.key, JSON.stringify(this.target));
    }
    return new Proxy(this.target, {
      set: (target, property, value) => {
        // 调用原始对象的 setter
        target[property] = value;

        // 将更改后的对象保存到 localstorage
        localStorage.setItem(this.key, JSON.stringify(target));

        // 返回 true，表示设置操作已成功
        return true;
      },
      get: (target, property) => {
        // 从 localStorage 中获取对象
        const storedObject = JSON.parse(localStorage.getItem(this.key)) || {};
        return storedObject[property] || target[property];
      },
    });
  }
}

export class Cache {
  _data: { [key: string]: any };
  constructor() {
    this._data = {};
  }

  get data() {
    return this._data;
  }

  init(data: object) {
    this._data = data;
  }

  set(name: string, value: any) {
    this._data[name] = value;
  }

  remove(name: string) {
    this._data[name] = null;
  }

  get(name: string) {
    return this._data[name];
  }
  getAll() {
    return this._data;
  }
}

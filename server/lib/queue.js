'use strict';

class Queue {
  constructor() {
    this.data = {};
    this.nextKey = 1;
  }

  store(key, value) {
    this.data[key] = value;
    return key;
  }

  read(key) {
    return this.data[key];
  }

  remove(key) {
    const value = this.data[key];
    delete this.data[key];
    return value;
  }

  getAll() {
    return { ...this.data };
  }

  size() {
    return Object.keys(this.data).length;
  }

  clear() {
    this.data = {};
  }

  peekKey() {
    return Object.keys(this.data)[0];
  }
}

module.exports = Queue;

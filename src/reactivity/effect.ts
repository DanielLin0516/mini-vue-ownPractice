import { extend } from "../shared";

class ReactiveEffect {
  private _fn: any;
  public schedular: Function | undefined;
  deps = [];
  active = true;
  onStop?: () => void;
  constructor(fn, schedular?: Function) {
    this._fn = fn;
    this.schedular = schedular;
  }
  run() {
    activeEffect = this;
    return this._fn();
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      if(this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect: any) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
}
// test
const targetMap = new Map();
export function track(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  if(!activeEffect) return;
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}
export function trigger(target, key) {
  const depMap = targetMap.get(target);
  let dep = depMap.get(key);
  for (const effect of dep) {
    if (effect.schedular) {
      effect.schedular();
    } else {
      effect.run();
    }
  }
}
let activeEffect;
export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.schedular);
  extend(_effect, options);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}
export function stop(runner) {
  runner.effect.stop();
}

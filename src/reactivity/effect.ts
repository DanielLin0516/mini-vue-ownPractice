import { extend } from "../shared";
let activeEffect;
let shouldTrack = false;

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
    if(!this.active) {
      return this._fn();
    }
    shouldTrack = true;
    activeEffect = this;
    const result = this._fn();
    //reset
    shouldTrack = false;

    return result;
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
  effect.deps.length = 0;
}
// test
const targetMap = new Map();

export function track(target, key) {
  if(!isTracking()) return;

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
  trackEffects(dep)
}
export function trackEffects(dep) {
  if(dep.has(activeEffect)) return;
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

export function trigger(target, key) {
  const depMap = targetMap.get(target);
  let dep = depMap.get(key);
  triggerEffects(dep);
}
export function triggerEffects(dep) {
  for (const effect of dep) {
    if (effect.schedular) {
      effect.schedular();
    } else {
      effect.run();
    }
  }
}
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

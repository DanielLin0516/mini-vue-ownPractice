import { readonly, isReadonly, isProxy } from "../reactive";

describe('readonly', () => {
  it("happy path", () => {
    const origin = { foo: 1, bar: { baz: 2 } };
    const wrapped = readonly(origin);
    expect(wrapped).not.toBe(origin);
    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(origin)).toBe(false);
    expect(wrapped.foo).toBe(1);
    expect(isProxy(wrapped)).toBe(true);
  })

  it("readonly set error", () => {
    console.warn = jest.fn();
    const user = readonly({ age: 1 });
    user.age = 2;
    expect(console.warn).toBeCalled();

  })
})
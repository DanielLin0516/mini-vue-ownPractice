import { effect } from "../effect";
import { reactive } from "../reactive";
import { isRef, proxyRefs, ref, unRef } from "../ref";

describe("ref", () => {
  it("happy path", () => {
    const a = ref(1);
    expect(a.value).toBe(1);
  })
  it("reactive", () => {
    const a = ref(1);
    let dummy;
    let calls = 0;
    effect(() => {
      calls++;
      dummy = a.value;
    });
    expect(dummy).toBe(1);
    expect(calls).toBe(1);
    a.value = 2;
    expect(dummy).toBe(2);
    expect(calls).toBe(2);
    a.value = 2;
    expect(dummy).toBe(2);
    expect(calls).toBe(2);
  })

  it("object", () => {
    const a = ref({
      count: 1
    })
    let dummy;
    effect(() => {
      dummy = a.value.count;
    })
    expect(dummy).toBe(1);
    a.value.count = 2;
    expect(dummy).toBe(2);
  })

  it("isRef", () => {
    const a = ref(1);
    const user = reactive({
      age: 10
    })
    expect(isRef(a)).toBe(true);
    expect(isRef(1)).toBe(false);
    expect(isRef(user)).toBe(false);
  })

  it("unRef", () => {
    const a = ref(1);
    expect(unRef(a)).toBe(1);
    expect(unRef(1)).toBe(1);
  })

  it("proxyRefs", () => {
    const user = {
      age: ref(10),
      name: "123"
    }
    const proxyUsers = proxyRefs(user);
    expect(proxyUsers.age).toBe(10);
    expect(user.age.value).toBe(10);
    expect(user.name).toBe("123");
    proxyUsers.age = 20;
    expect(proxyUsers.age).toBe(20);
    expect(user.age.value).toBe(20);
  })
})
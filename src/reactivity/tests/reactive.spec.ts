import { reacive } from "../reactive";
describe("reactive", () => {
  it("happy path", () => {
    const original = { foo: 1 };
    const observed = reacive(original);
    expect(observed).not.toBe(original);
    expect(observed.foo).toBe(1);
  });
});

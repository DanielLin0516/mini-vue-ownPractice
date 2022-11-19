import { shllowReadonly, isReadonly } from "../reactive";

describe('shallowReadonly', () => {
  test("shallowReadonly", () => {
    const props = shllowReadonly({ n: { foo: 1 } });
    expect(isReadonly(props)).toBe(true);
    expect(isReadonly(props.n)).toBe(false);
  })
})
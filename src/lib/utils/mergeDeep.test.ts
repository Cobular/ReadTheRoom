import { mergeDeep } from "./mergeDeep";

test('The most basic case should work', () => {
    const src = {
        a: "1"
    }
    const part = {
        b: "2"
    }

    // @ts-ignore
    expect(mergeDeep(src, part)).toStrictEqual({
        a: "1",
        b: "2"
    });
});
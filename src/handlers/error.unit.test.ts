import * as errUtils from "./error";
import { CustomError } from "./types";

const next = jest.fn();

const handlerArgs = [jest.fn(), jest.fn(), next];

afterEach(() => {
    jest.clearAllMocks();
});

describe("Function throwError", () => {
    it("creates a new error with correct shape and throws it", () => {
        expect(() => errUtils.throwErr("test msg", 500)).toThrow(CustomError);
    });
});

describe("Function withCatch", () => {
    it('causes all errors thrown within param function to be passed to "next"', async () => {
        const expected = new Error("test err");

        async function throwError() {
            throw expected;
        }

        await errUtils.withCatch(throwError)(1 as any, 2 as any, next);

        expect(next).toHaveBeenLastCalledWith(expected);
    });
});

import "@testing-library/jest-dom";

const util = require("util");
if (!(globalThis as any).TextEncoder) (globalThis as any).TextEncoder = util.TextEncoder;
if (!(globalThis as any).TextDecoder) (globalThis as any).TextDecoder = util.TextDecoder;

require("whatwg-fetch");
if (!(Response as any).json) {
  (Response as any).json = (data: any, init?: ResponseInit) =>
    new Response(JSON.stringify(data), {
      ...init,
      headers: {
        "content-type": "application/json",
        ...(init?.headers || {}),
      },
    });
}

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const React = require("react");
    const { alt, ...rest } = props;
    return React.createElement("img", { alt, ...rest });
  },
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...rest }: any) => {
    const React = require("react");
    return React.createElement("a", rest, children);
  },
}));

jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}));

beforeEach(() => {
  jest.spyOn(window, "alert").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

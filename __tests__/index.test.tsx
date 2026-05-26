import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

jest.mock(
  "~/assets",
  () =>
    new Proxy(
      {},
      {
        get: () => ({
          src: "/test-file-stub.png",
          height: 100,
          width: 100,
        }),
      },
    ),
);

// Mock Firebase module
jest.mock("~/utils/firebase/firebase", () => ({
  auth: {},
  db: {},
  analytics: {},
}));

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
    replace: jest.fn(),
    pathname: "/",
    route: "/",
    asPath: "/",
    query: {},
    isReady: true,
  }),
}));

import Home from "~/pages/index";
import { MobileMenuProvider } from "~/utils/contexts/mobile-menu";

describe("Home Page", () => {
  const Providers = ({ children }: { children: React.ReactElement }) => (
    <MobileMenuProvider>{children}</MobileMenuProvider>
  );

  it("renders H1 Tag Text", () => {
    render(
      <Providers>
        <Home />
      </Providers>,
    );

    const sectionTitle = screen.getByText(
      /The all-encompassing software solution for any retail business./i,
    );

    expect(sectionTitle).toBeInTheDocument();
  });
});

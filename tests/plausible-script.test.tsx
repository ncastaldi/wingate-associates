import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PlausibleScript } from "@/components/plausible-script";

const SRC = "https://plausible.example.test/js/pa-test.js";

describe("PlausibleScript", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    document.head.innerHTML = "";
  });

  it("renders nothing when NEXT_PUBLIC_PLAUSIBLE_SRC is unset", () => {
    vi.stubEnv("NEXT_PUBLIC_PLAUSIBLE_SRC", "");
    const { container } = render(<PlausibleScript />);
    expect(container).toBeEmptyDOMElement();
    expect(document.querySelector("script")).toBeNull();
  });

  it("loads the configured script and the init snippet when it is set", () => {
    vi.stubEnv("NEXT_PUBLIC_PLAUSIBLE_SRC", SRC);
    render(<PlausibleScript />);

    const external = document.querySelector(`script[src="${SRC}"]`);
    expect(external).not.toBeNull();

    const init = document.getElementById("plausible-init");
    expect(init).not.toBeNull();
    expect(init?.innerHTML).toContain("plausible.init()");
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CapabilityNotice } from "./capability-notice";

describe("CapabilityNotice", () => {
  it("lists specific recovery guidance for every unavailable capability", () => {
    render(<CapabilityNotice unsupported={[
      { key: "secure", label: "Secure connection", supported: false, recovery: "Open this site over HTTPS." },
      { key: "encoder", label: "Video encoder", supported: false, recovery: "Use current Chrome for Android." },
    ]} />);
    const alert = screen.getByRole("alert");
    expect(alert.getAttribute("aria-labelledby")).toBe("capability-title");
    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "Secure connection: Open this site over HTTPS.",
      "Video encoder: Use current Chrome for Android.",
    ]);
  });

  it("renders nothing when every capability is available", () => {
    const { container } = render(<CapabilityNotice unsupported={[]} />);
    expect(container.childElementCount).toBe(0);
  });
});

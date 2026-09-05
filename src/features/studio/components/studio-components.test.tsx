import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ProductCard } from "./product-catalog";
import { StudioContainer } from "./studio-container";
import { StudioPageHero, StudioSectionHeading, StudioShell } from "./studio-layout";
import { StudioNavigation } from "./studio-navigation";
import { StudioHero } from "./studio-hero";
import { comingSoonProducts, teleprompter } from "../product-catalog";
import TeleprompterProductPage from "@/app/teleprompter/page";

afterEach(cleanup);

describe("studio component-first surfaces", () => {
  it("renders the shared shell landmarks around page content", () => {
    render(<StudioShell><p>Page content</p></StudioShell>);
    expect(screen.getByRole("banner")).not.toBeNull();
    expect(screen.getByRole("main")).not.toBeNull();
    expect(screen.getByRole("contentinfo")).not.toBeNull();
    expect(screen.getByText("Page content")).not.toBeNull();
  });

  it("associates page and section headings with their supplied ids", () => {
    render(<StudioContainer><StudioPageHero eyebrow="Toolkit" title="Clear jobs" titleId="page-title" lede="One useful tool." /><section aria-labelledby="section-title"><StudioSectionHeading eyebrow="Ready" title="Available now" titleId="section-title" description="Open it today." /></section></StudioContainer>);
    expect(screen.getByRole("heading", { level: 1, name: "Clear jobs" }).id).toBe("page-title");
    expect(screen.getByRole("region", { name: "Available now" })).not.toBeNull();
  });

  it("keeps available product actions truthful and correctly targeted", () => {
    render(<ProductCard product={teleprompter} />);
    const card = screen.getByRole("article");
    expect(within(card).getByText("Available")).not.toBeNull();
    expect(within(card).getByRole("link", { name: /Explore Teleprompter/ }).getAttribute("href")).toBe(teleprompter.productHref);
    expect(within(card).getByRole("link", { name: "Open the tool" }).getAttribute("href")).toBe(teleprompter.appHref);
  });

  it("renders visible semantic links for the home hero actions", () => {
    render(<StudioHero />);
    expect(screen.getByRole("link", { name: /Open Studio/ }).getAttribute("href")).toBe("/studio");
    expect(screen.getByRole("link", { name: "Explore the tools" }).getAttribute("href")).toBe("/products");
  });

  it("renders coming-soon products as informational articles without actions", () => {
    const product = comingSoonProducts[0];
    render(<ProductCard product={product} />);
    const card = screen.getByRole("article");
    expect(within(card).getByText("Coming soon")).not.toBeNull();
    expect(within(card).queryByRole("link")).toBeNull();
    expect(within(card).queryByRole("button")).toBeNull();
  });

  it("exposes button-driven desktop navigation and labelled mobile navigation", () => {
    render(<StudioNavigation />);
    expect(screen.getByRole("navigation", { name: "Main navigation" })).not.toBeNull();
    const products = screen.getByRole("button", { name: "Products" });
    expect(products).not.toBeNull();
    expect(screen.getByRole("button", { name: "Solutions" })).not.toBeNull();
    fireEvent.click(products);
    expect(screen.getByRole("article", { name: "Code Animator, coming soon" })).not.toBeNull();
    expect(screen.queryByRole("button", { name: /Code Animator/ })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    expect(screen.getByRole("navigation", { name: "Mobile navigation" })).not.toBeNull();
    expect(screen.getByRole("link", { name: "View all" }).getAttribute("href")).toBe("/products");
  });

  it("uses accessible accordion disclosures for the support boundary", () => {
    render(<TeleprompterProductPage />);
    const requirements = screen.getByRole("button", { name: "Requirements" });
    const goodToKnow = screen.getByRole("button", { name: "Good to know" });
    expect(requirements.getAttribute("aria-expanded")).toBe("true");
    expect(goodToKnow.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(goodToKnow);
    expect(goodToKnow.getAttribute("aria-expanded")).toBe("true");
  });
});

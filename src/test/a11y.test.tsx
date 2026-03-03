import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { MemoryRouter } from "react-router-dom";

// Helper to wrap components with required providers
function renderWithProviders(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("Accessibility (axe-core)", () => {
  it("Index page has no WCAG A/AA violations", async () => {
    const { default: Index } = await import("@/pages/Index");
    const { container } = renderWithProviders(<Index />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  }, 15000);

  it("Settings page has no WCAG A/AA violations", async () => {
    const { default: Settings } = await import("@/pages/profile/Settings");
    const { container } = renderWithProviders(<Settings />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  }, 15000);

  it("Personal Details page has no WCAG A/AA violations", async () => {
    const { default: PersonalDetails } = await import(
      "@/pages/profile/PersonalDetails"
    );
    const { container } = renderWithProviders(<PersonalDetails />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  }, 15000);

  it("Agent Dashboard has no WCAG A/AA violations", async () => {
    const { default: AgentDashboard } = await import(
      "@/pages/agent/Dashboard"
    );
    const { container } = renderWithProviders(<AgentDashboard />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  }, 15000);

  it("RevShare Dashboard has no WCAG A/AA violations", async () => {
    const { default: RevShareDashboard } = await import(
      "@/pages/revshare/Dashboard"
    );
    const { container } = renderWithProviders(<RevShareDashboard />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  }, 15000);
});

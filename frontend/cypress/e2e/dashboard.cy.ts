// E2E tests for the dashboard. Requires both the Next.js dev server (port 3000)
// and the .NET backend (port 5000) to be running before executing.

describe("Dashboard", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("renders the page title", () => {
    cy.contains("Energy Consumption Dashboard").should("be.visible");
  });

  it("renders the chart after data loads", () => {
    // Highcharts renders into an SVG - presence of the container confirms
    // the chart mounted and data was returned from the backend.
    cy.get(".highcharts-container", { timeout: 10000 }).should("be.visible");
  });

  it("renders the delay toggle in the off state by default", () => {
    cy.get('[role="switch"]').should("have.attr", "aria-checked", "false");
  });

  it("shows the delay input when the toggle is switched on", () => {
    cy.get('[role="switch"]').click();
    cy.get('[role="switch"]').should("have.attr", "aria-checked", "true");
    cy.get("input[type='number']").should("be.visible");
    cy.contains("Simulating large dataset load").should("be.visible");
  });

  it("shows a loading state when delay is enabled and data is refetching", () => {
    cy.get('[role="switch"]').click();

    // Spinner should appear while the delayed fetch is in progress.
    cy.get(".ant-spin", { timeout: 5000 }).should("be.visible");

    // Chart should reappear once the fetch resolves.
    cy.get(".highcharts-container", { timeout: 15000 }).should("be.visible");
  });

  it("hides the delay input when the toggle is switched back off", () => {
    cy.get('[role="switch"]').click();
    cy.get('[role="switch"]').click();
    cy.get("input[type='number']").should("not.exist");
  });

  it("renders anomaly points on the chart", () => {
    cy.get(".highcharts-container", { timeout: 10000 }).should("be.visible");

    // Anomaly series is rendered as scatter points - confirm at least one exists.
    cy.get(".highcharts-series-2 .highcharts-point").should("have.length.greaterThan", 0);
  });
});

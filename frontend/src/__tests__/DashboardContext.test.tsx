import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DashboardProvider, useDashboard } from "@/context/DashboardContext";

// A minimal consumer component so we can assert on context values in the DOM.
function Consumer() {
  const { delayEnabled, delayMs, setDelayEnabled, setDelayMs } = useDashboard();
  return (
    <div>
      <span data-testid="delay-enabled">{String(delayEnabled)}</span>
      <span data-testid="delay-ms">{delayMs}</span>
      <button onClick={() => setDelayEnabled(true)}>enable</button>
      <button onClick={() => setDelayMs(5000)}>set delay</button>
    </div>
  );
}

describe("DashboardContext", () => {
  it("provides default values", () => {
    render(
      <DashboardProvider>
        <Consumer />
      </DashboardProvider>
    );

    expect(screen.getByTestId("delay-enabled")).toHaveTextContent("false");
    expect(screen.getByTestId("delay-ms")).toHaveTextContent("2000");
  });

  it("updates delayEnabled when setter is called", async () => {
    render(
      <DashboardProvider>
        <Consumer />
      </DashboardProvider>
    );

    await userEvent.click(screen.getByText("enable"));

    expect(screen.getByTestId("delay-enabled")).toHaveTextContent("true");
  });

  it("updates delayMs when setter is called", async () => {
    render(
      <DashboardProvider>
        <Consumer />
      </DashboardProvider>
    );

    await userEvent.click(screen.getByText("set delay"));

    expect(screen.getByTestId("delay-ms")).toHaveTextContent("5000");
  });

  it("throws when useDashboard is used outside DashboardProvider", () => {
    // Suppress the expected console.error from React's error boundary.
    jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Consumer />)).toThrow(
      "useDashboard must be used within DashboardProvider"
    );

    jest.restoreAllMocks();
  });
});

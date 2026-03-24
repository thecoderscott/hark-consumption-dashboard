import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DashboardProvider } from "@/context/DashboardContext";
import DelayToggle from "@/components/DelayToggle";

// Wrap in provider so the component can access context.
function renderWithProvider() {
  return render(
    <DashboardProvider>
      <DelayToggle />
    </DashboardProvider>
  );
}

describe("DelayToggle", () => {
  it("renders the switch in off state by default", () => {
    renderWithProvider();
    expect(screen.getByRole("switch")).not.toBeChecked();
  });

  it("does not show the delay input when toggle is off", () => {
    renderWithProvider();
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  });

  it("shows the delay input and label when toggled on", async () => {
    renderWithProvider();

    await userEvent.click(screen.getByRole("switch"));

    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
    expect(screen.getByText("Simulating large dataset load")).toBeInTheDocument();
  });

  it("hides the delay input when toggled back off", async () => {
    renderWithProvider();

    await userEvent.click(screen.getByRole("switch"));
    await userEvent.click(screen.getByRole("switch"));

    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  });
});

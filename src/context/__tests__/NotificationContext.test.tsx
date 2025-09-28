import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { NotificationProvider, useNotify } from "@/context/NotificationContext";

function Consumer() {
  const { addToast } = useNotify();
  return (
    <div>
      <button onClick={() => addToast({ type: "success", message: "Saved!" })}>add</button>
      <button onClick={() => addToast({ type: "error", message: "Oops" })}>addErr</button>
    </div>
  );
}

describe("NotificationContext", () => {
  it("adds toasts and allows dismissing them", async () => {
    render(
      <NotificationProvider>
        <Consumer />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByText("add"));
    fireEvent.click(screen.getByText("addErr"));

    const success = await screen.findByText("Saved!");
    const error = await screen.findByText("Oops");
    expect(success).toBeInTheDocument();
    expect(error).toBeInTheDocument();

    // Close one via the ✕ button (the close button is next to the message)
    const closeButtons = screen.getAllByRole("button", { name: /✕/i });
    fireEvent.click(closeButtons[0]);

    // One toast should remain
    expect(screen.queryByText("Saved!")).not.toBeInTheDocument();
    expect(screen.getByText("Oops")).toBeInTheDocument();
  });
});

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LineItem from "./LineItem";

describe("LineItem", () => {
  test("renders action items as native buttons", () => {
    const onClick = jest.fn();

    render(<LineItem onClick={onClick}>Run action</LineItem>);

    const button = screen.getByRole("button", { name: "Run action" });
    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveAttribute("type", "button");

    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("renders href items as links without nested button semantics", () => {
    render(<LineItem href="/dashboard">Dashboard</LineItem>);

    const link = screen.getByRole("link", { name: "Dashboard" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/dashboard");
    expect(link.querySelector("button,[role='button']")).toBeNull();
  });
});

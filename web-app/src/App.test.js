import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders login page", () => {
  render(<App />);
  const loginLabel = screen.getByText(/login to continue/i);
  expect(loginLabel).toBeInTheDocument();
});

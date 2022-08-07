import { render, screen, fireEvent } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import App from "./App";
import { testResult } from "./setupTests";

const expectedSearchTerm = "broadband";
const server = setupServer(
  rest.get(`/search`, (req, res, ctx) => {
    const searchTerm = req.url.searchParams.get("query");
    if (searchTerm === expectedSearchTerm) {
      return res(ctx.json(testResult));
    }
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("Previous button renders and is disabled on load", async () => {
  render(<App />);
  const previousButtonElement = screen.queryByTestId("previous-button");
  expect(previousButtonElement).toBeDisabled();
});

test("Next button renders and is disabled on load", () => {
  render(<App />);
  const nextPageButton = screen.getByTestId("next-button");
  expect(nextPageButton).toBeDisabled();
});

test("Search Function returns results", async () => {
  render(<App />);
  const inputSearch = screen.getByTestId("search-input");
  fireEvent.change(inputSearch, { target: { value: "broadband" } });
  fireEvent.keyDown(inputSearch, { key: "Enter", charCode: 13, code: "Enter" });
  await expect(
    screen.findByTestId("search-result-what-would-you-like-help-with")
  ).resolves.toBeTruthy();
});

test("Next Button goes to next page", async () => {
  render(<App />);
  const inputSearch = screen.getByTestId("search-input");
  const nextPageButton = screen.getByTestId("next-button");
  fireEvent.change(inputSearch, { target: { value: "broadband" } });
  fireEvent.keyDown(inputSearch, { key: "Enter", charCode: 13, code: "Enter" });
  await expect(
    screen.findByTestId("search-result-what-would-you-like-help-with")
  ).resolves.toBeTruthy();

  expect(nextPageButton).not.toBeDisabled();

  fireEvent(
    nextPageButton,
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    })
  );

  const pageOneSearchResult = screen.queryByTestId(
    "search-result-what-would-you-like-help-with"
  );
  const pageTwoSearchResult = screen.queryByTestId(
    "search-result-broadband-boost"
  );
  await expect(pageOneSearchResult).toBeNull();
  await expect(pageTwoSearchResult).toBeTruthy();
});

test("Previous Button goes to previous page", async () => {
  render(<App />);
  const inputSearch = screen.getByTestId("search-input");
  const nextPageButton = screen.getByTestId("next-button");
  const previousPageButton = screen.getByTestId("previous-button");

  fireEvent.change(inputSearch, { target: { value: "broadband" } });
  fireEvent.keyDown(inputSearch, { key: "Enter", charCode: 13, code: "Enter" });
  await expect(
    screen.findByTestId("search-result-what-would-you-like-help-with")
  ).resolves.toBeTruthy();

  expect(previousPageButton).toBeDisabled();

  fireEvent(
    nextPageButton,
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    })
  );

  expect(previousPageButton).not.toBeDisabled();

  fireEvent(
    previousPageButton,
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    })
  );
  const pageOneSearchResult = await screen.findByTestId(
    "search-result-what-would-you-like-help-with"
  );

  const pageTwoSearchResult = screen.queryByTestId(
    "search-result-broadband-boost"
  );
  await expect(pageOneSearchResult).toBeTruthy();
  await expect(pageTwoSearchResult).toBeNull();
});

test("Next Button is disabled on last page", async () => {
  render(<App />);
  const inputSearch = screen.getByTestId("search-input");
  const nextPageButton = screen.getByTestId("next-button");
  const numberOfPages = 8;
  fireEvent.change(inputSearch, { target: { value: "broadband" } });
  fireEvent.keyDown(inputSearch, {
    key: "Enter",
    charCode: 13,
    code: "Enter",
  });
  await expect(
    screen.findByTestId("search-result-what-would-you-like-help-with")
  ).resolves.toBeTruthy();

  expect(nextPageButton).not.toBeDisabled();

  for (let i = 1; i < numberOfPages; i++) {
    fireEvent(
      nextPageButton,
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      })
    );
  }

  const pageOneSearchResult = screen.queryByTestId(
    "search-result-what-would-you-like-help-with"
  );
  const lastPageSearchResult = screen.queryByTestId(
    "search-result-using-mcafee-internet-security-suite"
  );
  await expect(pageOneSearchResult).toBeNull();
  await expect(lastPageSearchResult).toBeTruthy();
});

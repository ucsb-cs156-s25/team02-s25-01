import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReviews/MenuItemReviewsCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("MenuItemReviewCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("ItemId")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /menuItemReviews", async () => {
    const queryClient = new QueryClient();
    const menuItemReview = {
      id: 3,
      itemId: "4",
      reviewerEmail: "test@test.com",
      stars: "15000",
      dateReviewed: "2023-12-12T12:12:12.000",
      comments: "it was the most amazing food of all time!",
    };

    axiosMock.onPost("/api/menuitemreview/post").reply(202, menuItemReview);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("ItemId")).toBeInTheDocument();
    });

    const itemIdInput = screen.getByLabelText("ItemId");
    expect(itemIdInput).toBeInTheDocument();

    const reviewerEmailInput = screen.getByLabelText("ReviewerEmail");
    expect(reviewerEmailInput).toBeInTheDocument();

    const starsInput = screen.getByLabelText("Stars");
    expect(starsInput).toBeInTheDocument();

    const dateReviewedInput = screen.getByLabelText(
      "Date Reviewed (iso format)",
    );
    expect(dateReviewedInput).toBeInTheDocument();

    const commentsInput = screen.getByLabelText("Comments");
    expect(commentsInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(itemIdInput, { target: { value: 4 } });
    fireEvent.change(reviewerEmailInput, {
      target: { value: "test@test.com" },
    });
    fireEvent.change(starsInput, { target: { value: 15000 } });
    fireEvent.change(dateReviewedInput, {
      target: { value: "2023-12-12T12:12:12" },
    });
    fireEvent.change(commentsInput, {
      target: { value: "it was the most amazing food of all time!" },
    });

    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      itemId: "4",
      reviewerEmail: "test@test.com",
      stars: "15000",
      dateReviewed: "2023-12-12T12:12:12.000",
      comments: "it was the most amazing food of all time!",
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toHaveBeenCalledWith(
      "New menuItemReview Created - id: 3 itemId: 4",
    );
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/menuItemReviews" });
  });
});

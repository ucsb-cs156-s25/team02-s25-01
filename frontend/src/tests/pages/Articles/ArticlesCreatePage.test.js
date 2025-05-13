import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
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

describe("ArticleCreatePage tests", () => {
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
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /articles", async () => {
    const queryClient = new QueryClient();
    const article = {
      id: 3,
      title: "test title",
      url: "google.com",
      explanation: "google search",
    email: "some@gmail.com",
    dateAdded : "2025-05-02T03:39:16"
    };

    axiosMock.onPost("/api/articles/post").reply(202, article);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    const TitleInput = screen.getByLabelText("Title");
    expect(TitleInput).toBeInTheDocument();

    const UrlInput = screen.getByLabelText("Url");
    expect(UrlInput).toBeInTheDocument();

    const ExplanationInput = screen.getByLabelText("Explanation");
    expect(ExplanationInput).toBeInTheDocument();

    const EmailInput = screen.getByLabelText("Email");
    expect(EmailInput).toBeInTheDocument();

    const DateAddedInput = screen.getByLabelText("Date Added (in UTC)");
    expect(DateAddedInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();


    fireEvent.change(TitleInput, { target: { value: "test title" } });
    fireEvent.change(UrlInput, { target: { value: "google.com" } });
    fireEvent.change(ExplanationInput, { target: { value: "google search" } });
    fireEvent.change(EmailInput, { target: { value: "some@gmail.com" } });
    fireEvent.change(DateAddedInput, { target: { value: "2025-05-02T03:39:16" } });
    
    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
        title: "test title",
        url: "google.com",
        explanation: "google search",
      email: "some@gmail.com",
      dateAdded : "2025-05-02T03:39:16"
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toBeCalledWith(
      "New article Created - id: 3 title: test title",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/articles" });
  });
});

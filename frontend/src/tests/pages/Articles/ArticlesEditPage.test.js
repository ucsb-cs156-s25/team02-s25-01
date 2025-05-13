import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

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
    useParams: () => ({
      id: 17,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("ArticleEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/articles", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticlesEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Article");
      expect(screen.queryByTestId("Article-name")).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/articles", { params: { id: 17 } }).reply(200, {
        id : 17,
        title: "test title",
        url: "google.com",
        explanation: "google search",
      email: "some@gmail.com",
      dateAdded : "2025-05-02T03:39:16Z"
      });
      axiosMock.onPut("/api/articles").reply(200, {
        id: "17",
        title: "test title",
        url: "google.com",
        explanation: "google search",
      email: "some@gmail.com",
      dateAdded : "2025-05-02T03:39:16Z"
      });
    });

    // const queryClient = new QueryClient();

    // test("Is populated with the data provided", async () => {
    //   render(
    //     <QueryClientProvider client={queryClient}>
    //       <MemoryRouter>
    //         <ArticlesEditPage />
    //       </MemoryRouter>
    //     </QueryClientProvider>,
    //   );

    //   await screen.findByTestId("ArticleForm-id");

    //   const idField = screen.getByTestId("ArticleForm-id");
    //   const nameField = screen.getByTestId("ArticleForm-name");
    //   const descriptionField = screen.getByTestId("ArticleForm-description");
    //   const submitButton = screen.getByTestId("ArticleForm-submit");

    //   expect(idField).toBeInTheDocument();
    //   expect(idField).toHaveValue("17");
    //   expect(nameField).toBeInTheDocument();
    //   expect(nameField).toHaveValue("Freebirds");
    //   expect(descriptionField).toBeInTheDocument();
    //   expect(descriptionField).toHaveValue("Burritos");

    //   expect(submitButton).toHaveTextContent("Update");

    //   fireEvent.change(nameField, {
    //     target: { value: "Freebirds World Burrito" },
    //   });
    //   fireEvent.change(descriptionField, {
    //     target: { value: "Totally Giant Burritos" },
    //   });
    //   fireEvent.click(submitButton);

    //   await waitFor(() => expect(mockToast).toBeCalled());
    //   expect(mockToast).toBeCalledWith(
    //     "Article Updated - id: 17 name: Freebirds World Burrito",
    //   );

    //   expect(mockNavigate).toBeCalledWith({ to: "/articles" });

    //   expect(axiosMock.history.put.length).toBe(1); // times called
    //   expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
    //   expect(axiosMock.history.put[0].data).toBe(
    //     JSON.stringify({
    //       name: "Freebirds World Burrito",
    //       description: "Totally Giant Burritos",
    //     }),
    //   ); // posted object
    // });

    // test("Changes when you click Update", async () => {
    //   render(
    //     <QueryClientProvider client={queryClient}>
    //       <MemoryRouter>
    //         <ArticlesEditPage />
    //       </MemoryRouter>
    //     </QueryClientProvider>,
    //   );

    //   await screen.findByTestId("ArticleForm-id");

    //   const idField = screen.getByTestId("ArticleForm-id");
    //   const nameField = screen.getByTestId("ArticleForm-name");
    //   const descriptionField = screen.getByTestId("ArticleForm-description");
    //   const submitButton = screen.getByTestId("ArticleForm-submit");

    //   expect(idField).toHaveValue("17");
    //   expect(nameField).toHaveValue("Freebirds");
    //   expect(descriptionField).toHaveValue("Burritos");
    //   expect(submitButton).toBeInTheDocument();

    //   fireEvent.change(nameField, {
    //     target: { value: "Freebirds World Burrito" },
    //   });
    //   fireEvent.change(descriptionField, { target: { value: "Big Burritos" } });

    //   fireEvent.click(submitButton);

    //   await waitFor(() => expect(mockToast).toBeCalled());
    //   expect(mockToast).toBeCalledWith(
    //     "Article Updated - id: 17 name: Freebirds World Burrito",
    //   );
    //   expect(mockNavigate).toBeCalledWith({ to: "/articles" });
    // });
  });
});

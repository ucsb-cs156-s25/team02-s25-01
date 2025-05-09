import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemCreatePage from "main/pages/MenuItems/MenuItemCreatePage";
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

describe("MenuItemCreatePage tests", () => {
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
          <MenuItemCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /menuItem", async () => {
    const queryClient = new QueryClient();
    const restaurant = {
      id: 9,
      diningCommonsCode: "12345",
      name: "South Coast Deli",
      station: "Sandwiches and Salads",
    };

    axiosMock
      .onPost("/api/UCSBDiningCommonsMenuItem/post")
      .reply(202, restaurant);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toBeInTheDocument();
    });

    const diningCommonsCodeInput = screen.getByLabelText("Dining Commons Code");
    expect(diningCommonsCodeInput).toBeInTheDocument();

    const nameInput = screen.getByLabelText("Name");
    expect(nameInput).toBeInTheDocument();

    const stationInput = screen.getByLabelText("Station");
    expect(stationInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(diningCommonsCodeInput, { target: { value: "12345" } });
    fireEvent.change(nameInput, { target: { value: "South Coast Deli" } });
    fireEvent.change(stationInput, {
      target: { value: "Sandwiches and Salads" },
    });

    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      diningCommonsCode: "12345",
      name: "South Coast Deli",
      station: "Sandwiches and Salads",
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toHaveBeenCalledWith(
      "New menu Item Created - id: 9 name: South Coast Deli",
    );
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/menuItems" });
  });
});

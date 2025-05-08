import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemEditPage from "main/pages/MenuItems/MenuItemEditPage";

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

describe("MenuItemEditPage tests", () => {
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
      axiosMock
        .onGet("/api/UCSBDiningCommonsMenuItem", { params: { id: 17 } })
        .timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Menu Item");
      expect(screen.queryByTestId("MenuItem-name")).not.toBeInTheDocument();
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
      axiosMock
        .onGet("/api/UCSBDiningCommonsMenuItem", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          diningCommonsCode: 123,
          name: "Pizza",
          station: "Oven",
        });
      axiosMock.onPut("/api/UCSBDiningCommonsMenuItem").reply(200, {
        id: 17,
        diningCommonsCode: "098",
        name: "Turkey",
        station: "Lunch",
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemForm-id");

      const idField = screen.getByTestId("MenuItemForm-id");
      const diningCommonsCodeField = screen.getByLabelText(
        "Dining Commons Code",
      );
      const nameField = screen.getByTestId("MenuItemForm-name");
      const stationField = screen.getByLabelText("Station");
      const submitButton = screen.getByText("Update");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");

      expect(diningCommonsCodeField).toBeInTheDocument();
      expect(diningCommonsCodeField).toHaveValue("123");

      expect(nameField).toBeInTheDocument();
      expect(nameField).toHaveValue("Pizza");

      expect(stationField).toBeInTheDocument();
      expect(stationField).toHaveValue("Oven");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(diningCommonsCodeField, {
        target: { value: "098" },
      });
      fireEvent.change(nameField, {
        target: { value: "Turkey" },
      });
      fireEvent.change(stationField, {
        target: { value: "Lunch" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Menu Item Updated - id: 17 name: Turkey",
      );

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/menuItems" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          diningCommonsCode: "098",
          name: "Turkey",
          station: "Lunch",
        }),
      ); // posted object
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemForm-id");

      const idField = screen.getByTestId("MenuItemForm-id");
      const diningCommonsCodeField = screen.getByLabelText(
        "Dining Commons Code",
      );
      const nameField = screen.getByTestId("MenuItemForm-name");
      const stationField = screen.getByLabelText("Station");
      const submitButton = screen.getByText("Update");

      expect(idField).toHaveValue("17");
      expect(diningCommonsCodeField).toHaveValue("123");
      expect(nameField).toHaveValue("Pizza");
      expect(stationField).toHaveValue("Oven");
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(diningCommonsCodeField, { target: { value: "098" } });
      fireEvent.change(nameField, { target: { value: "Turkey" } });
      fireEvent.change(stationField, { target: { value: "Lunch" } });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Menu Item Updated - id: 17 name: Turkey",
      );
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/menuItems" });
    });
  });
});

import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";

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

describe("HelpRequestEditPage tests", () => {
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
      axiosMock.onGet("/api/helprequest", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit HelpRequest");
      expect(
        screen.queryByTestId("HelpRequest-requesterEmail"),
      ).not.toBeInTheDocument();
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
      axiosMock.onGet("/api/helprequest", { params: { id: 17 } }).reply(200, {
        id: 17,
        requesterEmail: "hjin133@ucsb.edu",
        teamId: "01",
        tableOrBreakoutRoom: "table1",
        requestTime: "2025-05-01T17:22:01",
        explanation: "I got an error message",
        solved: true,
      });
      axiosMock.onPut("/api/helprequest").reply(200, {
        id: "17",
        requesterEmail: "hjin133@csil.cs.ucsb.edu",
        teamId: "02",
        tableOrBreakoutRoom: "table2",
        requestTime: "2025-05-01T17:23:01",
        explanation: "I got some error messages",
        solved: true,
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided and changes when data is changed", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-id");

      const idField = screen.getByTestId("HelpRequestForm-id");
      const requesterEmailField = screen.getByTestId(
        "HelpRequestForm-requesterEmail",
      );
      const teamIdField = screen.getByLabelText("Team Id");
      const tableOrBreakoutRoomField = screen.getByLabelText(
        "Table Or Breakout Room",
      );
      const requestTimeField = screen.getByLabelText(
        "Request Time (iso format)",
      );
      const explanationField = screen.getByLabelText("Explanation");
      const solvedField = screen.getByLabelText("Solved");

      const submitButton = screen.getByText("Update");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toBeInTheDocument();
      expect(requesterEmailField).toHaveValue("hjin133@ucsb.edu");
      expect(teamIdField).toBeInTheDocument();
      expect(teamIdField).toHaveValue("01");
      expect(tableOrBreakoutRoomField).toBeInTheDocument();
      expect(tableOrBreakoutRoomField).toHaveValue("table1");
      expect(requestTimeField).toBeInTheDocument();
      expect(requestTimeField).toHaveValue("2025-05-01T17:22:01.000");
      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("I got an error message");
      expect(solvedField).toBeInTheDocument();
      expect(solvedField).toBeChecked();

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(requesterEmailField, {
        target: { value: "hjin133@csil.cs.ucsb.edu" },
      });

      fireEvent.change(teamIdField, {
        target: { value: "02" },
      });

      fireEvent.change(tableOrBreakoutRoomField, {
        target: { value: "table2" },
      });

      fireEvent.change(requestTimeField, {
        target: { value: "2025-05-01T17:23:01.000" },
      });

      fireEvent.change(explanationField, {
        target: { value: "I got some error messages" },
      });

      fireEvent.change(solvedField, {
        target: { value: "true" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "HelpRequest Updated - id: 17 requesterEmail: hjin133@csil.cs.ucsb.edu",
      );

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/helprequest" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "hjin133@csil.cs.ucsb.edu",
          teamId: "02",
          tableOrBreakoutRoom: "table2",
          requestTime: "2025-05-01T17:23:01.000",
          explanation: "I got some error messages",
          solved: true,
        }),
      ); // posted object
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/helprequest" });
    });
  });
});

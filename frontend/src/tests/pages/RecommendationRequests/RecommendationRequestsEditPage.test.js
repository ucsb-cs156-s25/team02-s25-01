import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RecommendationRequestsEditPage from "main/pages/RecommendationRequests/RecommendationRequestsEditPage";

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

describe("RecommendationRequestsEditPage tests", () => {
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
        .onGet("/api/recommendationrequest", { params: { id: 17 } })
        .timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Recommendation Request");
      expect(
        screen.queryByTestId("RecommendationRequest-explanation"),
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
      axiosMock
        .onGet("/api/recommendationrequest", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          requesterEmail: "studentName@ucsb.edu",
          professorEmail: "professorName@ucsb.edu",
          explanation: "I need a letter of recommendation...",
          dateRequested: "2025-01-01T00:00:01",
          dateNeeded: "2025-05-01T00:00:01",
          done: true,
        });
      axiosMock.onPut("/api/recommendationrequest").reply(200, {
        id: "17",
        requesterEmail: "studentName45@ucsb.edu",
        professorEmail: "professorName54@ucsb.edu",
        explanation: "I need a letter of recommendation.....",
        dateRequested: "2025-01-01T02:00:02",
        dateNeeded: "2025-05-01T03:00:02",
        done: false,
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("RecommendationRequestForm-id");

      const idField = screen.getByTestId("RecommendationRequestForm-id");
      const requesterEmailField = screen.getByLabelText("Requester Email");
      const professorEmailField = screen.getByLabelText("Professor Email");
      const explanationField = screen.getByLabelText("Explanation");
      const dateRequestedField = screen.getByLabelText(
        "Date Requested (iso format)",
      );
      const dateNeededField = screen.getByLabelText("Date Needed (iso format)");
      const doneField = screen.getByLabelText("Done");
      const submitButton = screen.getByText("Update");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");

      expect(requesterEmailField).toBeInTheDocument();
      expect(requesterEmailField).toHaveValue("studentName@ucsb.edu");

      expect(professorEmailField).toBeInTheDocument();
      expect(professorEmailField).toHaveValue("professorName@ucsb.edu");

      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue(
        "I need a letter of recommendation...",
      );

      expect(dateRequestedField).toBeInTheDocument();
      expect(dateRequestedField).toHaveValue("2025-01-01T00:00:01.000");

      expect(dateNeededField).toBeInTheDocument();
      expect(dateNeededField).toHaveValue("2025-05-01T00:00:01.000");

      expect(doneField).toBeInTheDocument();
      expect(doneField).toBeChecked();

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(requesterEmailField, {
        target: { value: "studentName45@ucsb.edu" },
      });
      fireEvent.change(professorEmailField, {
        target: { value: "professorName54@ucsb.edu" },
      });
      fireEvent.change(explanationField, {
        target: { value: "I need a letter of recommendation....." },
      });
      fireEvent.change(dateRequestedField, {
        target: { value: "2025-01-01T02:00:02" },
      });
      fireEvent.change(dateNeededField, {
        target: { value: "2025-05-01T03:00:02" },
      });

      fireEvent.click(doneField);
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Recommendation Request Updated - id: 17 explanation: I need a letter of recommendation.....",
      );

      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/recommendationrequest",
      });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "studentName45@ucsb.edu",
          professorEmail: "professorName54@ucsb.edu",
          explanation: "I need a letter of recommendation.....",
          dateRequested: "2025-01-01T02:00:02.000",
          dateNeeded: "2025-05-01T03:00:02.000",
          done: false,
        }),
      ); // posted object

      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/recommendationrequest",
      });
    });
  });
});

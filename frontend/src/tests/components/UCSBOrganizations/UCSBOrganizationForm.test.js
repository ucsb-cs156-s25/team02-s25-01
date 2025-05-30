import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import UCSBOrganizationForm from "main/components/UCSBOrganizations/UCSBOrganizationForm";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UCSBOrganizationForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "OrgCode",
    "OrgTranslationShort",
    "OrgTranslation",
    "Inactive",
  ];
  const testId = "UCSBOrganizationForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm
            initialContents={ucsbOrganizationFixtures.oneOrganization[0]}
          />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-orgCode`)).toBeInTheDocument();
    expect(screen.getByText("OrgCode")).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-orgCode`)).toHaveValue("ZPR");

    expect(
      await screen.findByTestId(`${testId}-orgTranslationShort`),
    ).toBeInTheDocument();
    expect(screen.getByText("OrgTranslationShort")).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-orgTranslationShort`)).toHaveValue(
      "Zeta Phi Rho",
    );

    expect(
      await screen.findByTestId(`${testId}-orgTranslation`),
    ).toBeInTheDocument();
    expect(screen.getByText("OrgTranslation")).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-orgTranslation`)).toHaveValue(
      "Zeta Phi Rho",
    );

    const inactiveDropdown = await screen.findByTestId(`${testId}-inactive`);
    expect(inactiveDropdown).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-inactive`)).toHaveValue("false");
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-submit`)).toBeVisible();
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/OrgCode is required/);
    await screen.findByText(/OrgTranslationShort is required/);
    await screen.findByText(/OrgTranslation is required/);
    await screen.findByText(/Inactive is required/);
  });

  test("dropdown for inactive can be selected", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );

    const inactiveDropdown = screen.getByTestId(`${testId}-inactive`);
    expect(inactiveDropdown).toBeInTheDocument();

    fireEvent.change(inactiveDropdown, { target: { value: "true" } });
    expect(inactiveDropdown.value).toBe("true");

    fireEvent.change(inactiveDropdown, { target: { value: "false" } });
    expect(inactiveDropdown.value).toBe("false");
  });
});

import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/helpRequestUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function HelpRequestTable({
  helprequest,
  currentUser,
  testIdPrefix = "HelpRequestTable",
}) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/helprequest/edit/${cell.row.values.id}`);
  };

  // Stryker disable all : hard to test for query caching

  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/helprequest/all"],
  );
  // Stryker restore all

  // Stryker disable next-line all : TODO try to make a good test for this
  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  const columns = [
    {
      Header: "id",
      accessor: "id", // accessor is the "key" in the data
    },

    {
      Header: "Requester Email",
      accessor: "requesterEmail",
    },
    {
      Header: "Team Id",
      accessor: "teamId",
    },
    {
      Header: "Table Or Breakout Room",
      accessor: "tableOrBreakoutRoom",
    },
    {
      Header: "Request Time",
      accessor: "requestTime",
    },
    {
      Header: "Explanation",
      accessor: "explanation",
    },
    {
      Header: "Solved",
      accessor: "solved",
    },
  ];

  if (hasRole(currentUser, "ROLE_ADMIN")) {
    columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
    columns.push(
      ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix),
    );
  }

  return (
    <OurTable data={helprequest} columns={columns} testid={testIdPrefix} />
  );
}

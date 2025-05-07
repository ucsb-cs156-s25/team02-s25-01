import React from "react";
import { useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MenuItemTable from "main/components/MenuItems/MenuItemTable";
import { useCurrentUser, hasRole } from "main/utils/currentUser";
import { Button } from "react-bootstrap";

export default function MenuItemIndexPage() {
  const currentUser = useCurrentUser();

  const {
    data: menuItems,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/UCSBDiningCommonsMenuItem/all"],
    { method: "GET", url: "/api/UCSBDiningCommonsMenuItem/all" },
    // Stryker disable next-line all : don't test default value of empty list
    [],
  );

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
      return (
        <Button
          variant="primary"
          href="/menuItem/create"
          style={{ float: "right" }}
        >
          Create Menu Item
        </Button>
      );
    }
  };

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>Menu Item</h1>
        <MenuItemTable menuItems={menuItems} currentUser={currentUser} />
      </div>
    </BasicLayout>
  );
}

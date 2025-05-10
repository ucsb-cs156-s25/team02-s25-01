import React from "react";
import MenuItemTable from "main/components/MenuItems/MenuItemTable";
import { MenuItemFixtures } from "fixtures/MenuItemFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/MenuItems/MenuItemTable",
  component: MenuItemTable,
};

const Template = (args) => {
  return <MenuItemTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  menuItems: [],
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  menuItems: MenuItemFixtures.threeMenuItems,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  menuItems: MenuItemFixtures.threeMenuItems,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/UCSBDiningCommonsMenuItem", () => {
      return HttpResponse.json(
        { message: "Menu Item deleted successfully" },
        { status: 200 },
      );
    }),
  ],
};

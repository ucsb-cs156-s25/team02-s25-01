import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { MenuItemFixtures } from "fixtures/MenuItemFixtures";
import { http, HttpResponse } from "msw";

import MenuItemIndexPage from "main/pages/MenuItems/MenuItemIndexPage";

export default {
  title: "pages/MenuItems/MenuItemIndexPage",
  component: MenuItemIndexPage,
};

const Template = () => <MenuItemIndexPage storybook={true} />;

export const Empty = Template.bind({});
Empty.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.get("/api/UCSBDiningCommonsMenuItem/all", () => {
      return HttpResponse.json([], { status: 200 });
    }),
  ],
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly);
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither);
    }),
    http.get("/api/UCSBDiningCommonsMenuItem/all", () => {
      return HttpResponse.json(MenuItemFixtures.threeMenuItems);
    }),
  ],
};

export const ThreeItemsAdminUser = Template.bind({});

ThreeItemsAdminUser.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.adminUser);
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither);
    }),
    http.get("/api/UCSBDiningCommonsMenuItem/all", () => {
      return HttpResponse.json(MenuItemFixtures.threeMenuItems);
    }),
    http.delete("/api/UCSBDiningCommonsMenuItem", () => {
      return HttpResponse.json(
        { message: "Menu Item deleted successfully" },
        { status: 200 },
      );
    }),
  ],
};

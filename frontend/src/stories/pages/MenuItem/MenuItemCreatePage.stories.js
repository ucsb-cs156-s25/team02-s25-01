import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import MenuItemCreatePage from "main/pages/MenuItems/MenuItemCreatePage";

import { MenuItemFixtures } from "fixtures/MenuItemFixtures";

export default {
  title: "pages/MenuItems/MenuItemCreatePage",
  component: MenuItemCreatePage,
};

const Template = () => <MenuItemCreatePage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
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
    http.post("/api/UCSBDiningCommonsMenuItem/post", () => {
      return HttpResponse.json(MenuItemFixtures.oneMenuItem, { status: 200 });
    }),
  ],
};

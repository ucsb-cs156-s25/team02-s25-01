import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import MenuItemReviewEditPage from "main/pages/MenuItemReviews/MenuItemReviewsEditPage";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";

export default {
  title: "pages/MenuItemReviews/MenuItemReviewsEditPage",
  component: MenuItemReviewEditPage,
};

const Template = () => <MenuItemReviewEditPage storybook={true} />;

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
    http.get("/api/menuitemreview", () => {
      return HttpResponse.json(menuItemReviewFixtures.threeMenuItemReviews[0], {
        status: 200,
      });
    }),
    http.put("/api/menuitemreview", () => {
      return HttpResponse.json(
        {
          id: 1,
          itemId: 4,
          reviewerEmail: "chris_gaucho@ucsb.edu",
          stars: 5,
          dateReviewed: "2025-01-20T14:20:00",
          comments: "The Pizza was great!",
        },
        { status: 200 },
      );
    }),
  ],
};

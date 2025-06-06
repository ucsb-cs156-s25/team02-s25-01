import React from "react";
import RecommendationRequestTable from "main/components/RecommendationRequest/RecommendationRequestTable";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/RecommendationRequest/RecommendationRequestTable",
  component: RecommendationRequestTable,
};

const Template = (args) => {
  return <RecommendationRequestTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  recommendationRequests: [],
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  recommendationRequests:
    recommendationRequestFixtures.threeRecommendationRequest,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  recommendationRequests:
    recommendationRequestFixtures.threeRecommendationRequest,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/recommendationrequest", () => {
      return HttpResponse.json(
        { message: "Recommendation Request deleted successfully" },
        { status: 200 },
      );
    }),
  ],
};

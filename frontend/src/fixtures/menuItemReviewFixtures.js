const menuItemReviewFixtures = {
  oneMenuItemReview: {
    id: 1,
    itemId: 4,
    reviewerEmail: "chris_gaucho@ucsb.edu",
    stars: 5,
    dateReviewed: "2025-01-20T14:20:00",
    comments: "The Pizza was great!",
  },
  threeMenuItemReviews: [
    {
      id: 1,
      itemId: 4,
      reviewerEmail: "chris_gaucho@ucsb.edu",
      stars: 5,
      dateReviewed: "2025-01-20T14:20:00",
      comments: "The Pizza was great!",
    },
    {
      id: 3,
      itemId: 3,
      reviewerEmail: "bob_gaucho@ucsb.edu",
      stars: 4,
      dateReviewed: "2025-03-12T13:20:00",
      comments: "The burger was great!",
    },
    {
      id: 4,
      itemId: 6,
      reviewerEmail: "becky_gaucho@ucsb.edu",
      stars: 1,
      dateReviewed: "2025-04-01T10:20:00",
      comments: "The soup was horrible!",
    },
  ],
};

export { menuItemReviewFixtures };

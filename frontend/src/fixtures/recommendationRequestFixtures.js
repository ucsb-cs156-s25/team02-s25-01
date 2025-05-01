const recommendationRequestFixtures = {
  oneRecommendationRequest: {
    id: 3,
    requesterEmail: "studentName@ucsb.edu",
    professorEmail: "professorName@ucsb.edu",
    explanation: "I need a letter of recommendation...",
    dateRequested: "2025-01-01T00:00:00",
    dateNeeded: "2025-05-01T00:00:00",
    done: true,
  },
  threeRecommendationRequest: [
    {
      id: 3,
      requesterEmail: "studentName@ucsb.edu",
      professorEmail: "professorName@ucsb.edu",
      explanation: "I need a letter of recommendation...",
      dateRequested: "2025-01-01T00:00:00",
      dateNeeded: "2025-05-01T00:00:00",
      done: true,
    },
    {
      id: 4,
      requesterEmail: "studentName1@ucsb.edu",
      professorEmail: "professorName1@ucsb.edu",
      explanation: "I need a recommendation letter...",
      dateRequested: "2025-01-02T00:00:00",
      dateNeeded: "2025-05-02T00:00:00",
      done: false,
    },
    {
      id: 5,
      requesterEmail: "studentName2@ucsb.edu",
      professorEmail: "professorName2@ucsb.edu",
      explanation: "I need a recommendation letter for...",
      dateRequested: "2025-01-03T00:00:00",
      dateNeeded: "2025-05-03T00:00:00",
      done: false,
    },
  ],
};

export { recommendationRequestFixtures };

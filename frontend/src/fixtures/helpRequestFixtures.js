const helpRequesrFixtures = {
    oneHelpRequest: {
        "id": 2,
        "requesterEmail": "hjin133@ucsb.edu",
        "teamId": "01",
        "tableOrBreakoutRoom": "table1",
        "requestTime": "2025-05-01T17:22:00",
        "explanation": "I got an error message",
        "solved": true
    },
    threeHelpRequests: [
        {
          "id": 2,
          "requesterEmail": "hjin133@ucsb.edu",
          "teamId": "01",
          "tableOrBreakoutRoom": "table1",
          "requestTime": "2025-05-01T17:22:00",
          "explanation": "I got an error message",
          "solved": true
        },
        {
          "id": 3,
          "requesterEmail": "anyone@ucsb.edu",
          "teamId": "11",
          "tableOrBreakoutRoom": "BreakoutRoom 3",
          "requestTime": "2025-04-28T18:00:00",
          "explanation": "I need a help",
          "solved": false
        },
        {
          "id": 4,
          "requesterEmail": "somebody@ucsb.edu",
          "teamId": "02",
          "tableOrBreakoutRoom": "BreakoutRoom 1",
          "requestTime": "2025-04-30T18:00:00",
          "explanation": "I need technical assistance",
          "solved": true
        }

    ],
  };
  
  export { helpRequesrFixtures };
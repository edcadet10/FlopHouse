// This function will retrieve stories from the data files
exports.handler = async (event, context) => {
  try {
    // For initial development, return mock data
    // Later, this would read from JSON files in the repo
    const mockStories = [
      {
        id: 1,
        title: "TaskMaster: What Went Wrong",
        companyName: "TaskMaster Inc.",
        industry: "SaaS",
        fundingAmount: "$1.2M",
        failureReason: "Lack of Product-Market Fit",
        summary: "A deep dive into how we misunderstood the market need and built features nobody wanted.",
        date: "3 days ago",
        readTime: "5 min read",
        upvotes: 24
      },
      {
        id: 2,
        title: "CodeBuddy: Our Journey to Shutdown",
        companyName: "CodeBuddy",
        industry: "Developer Tools",
        fundingAmount: "$800K",
        failureReason: "Business Model",
        summary: "We built a great product that developers loved, but our business model couldn't sustain growth.",
        date: "1 week ago",
        readTime: "7 min read",
        upvotes: 56
      },
      {
        id: 3,
        title: "LaunchNow: The No-Code Platform That Failed",
        companyName: "LaunchNow",
        industry: "No-Code",
        fundingAmount: "$3.5M",
        failureReason: "Competition",
        summary: "Our no-code platform gained early traction but failed to convert free users to paying customers.",
        date: "2 weeks ago",
        readTime: "6 min read",
        upvotes: 38
      }
    ];
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(mockStories)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
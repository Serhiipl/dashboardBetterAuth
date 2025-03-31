import React from "react";

const DashboardPage = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <p>
        Welcome to your dashboard! Here you can manage your data and view
        insights.
      </p>
      <div style={{ marginTop: "20px" }}>
        <h2>Overview</h2>
        <p>Quick stats and summaries will appear here.</p>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>Recent Activity</h2>
        <p>Your recent actions and updates will be displayed here.</p>
      </div>
    </div>
  );
};

export default DashboardPage;

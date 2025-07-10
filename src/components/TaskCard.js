import React from "react";

function TaskCard({ task }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
      <h4>{task.title}</h4>
      <p>{task.description}</p>
    </div>
  );
}

export default TaskCard;

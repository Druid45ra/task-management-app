import React, { useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useStore from "../store/useStore";
import TaskCard from "./TaskCard";
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL);

function Board() {
  const tasks = useStore((state) => state.tasks);
  const setTasks = useStore((state) => state.setTasks);
  const updateTask = useStore((state) => state.updateTask);

  useEffect(() => {
    // Fetch tasks from backend
    fetch(`${process.env.REACT_APP_API_URL}/tasks`)
      .then((res) => res.json())
      .then((data) => setTasks(data));

    // Listen for real-time updates
    socket.on("taskUpdated", (updatedTask) => {
      updateTask(updatedTask);
    });

    return () => socket.off("taskUpdated");
  }, [setTasks, updateTask]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const task = tasks.find((t) => t._id === result.draggableId);
    const updatedTask = { ...task, status: result.destination.droppableId };
    await fetch(`${process.env.REACT_APP_API_URL}/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });
    socket.emit("updateTask", updatedTask);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="container">
        {["To Do", "In Progress", "Done"].map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <h3>{status}</h3>
                {tasks
                  .filter((task) => task.status === status)
                  .map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

export default Board;

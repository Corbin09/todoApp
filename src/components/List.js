import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { useGlobalContext } from "../context/context";
import Task from "./Task";

const List = () => {
  const { tasks, filter } = useGlobalContext();

  return (
    <Droppable droppableId='tasks-list'>
      {(provided, snapshot) => (
        <ul
          className='tasks-wrapper'
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {tasks.map((task, i) => {
            const shouldRender =
              filter === "all" ||
              (filter === "completed" && task.completed) ||
              (filter === "uncompleted" && !task.completed);

            if (shouldRender) {
              return (
                <Task
                  key={task.id}
                  {...task}
                  index={i}
                  createdAt={task.createdAt}
                />
              );
            }
            return null;
          })}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  );
};

export default List;

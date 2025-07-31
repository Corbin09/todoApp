import { Draggable } from "react-beautiful-dnd";
import {
  MdCheckBoxOutlineBlank,
  MdCheckBox,
  MdDeleteOutline,
  MdOutlineColorLens,
} from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { useGlobalContext } from "../context/context";

const Task = ({ id, name, completed, color, index, createdAt, startDate, dueDate }) => { 
  const { removeTask, toggleDone, editTask, showColors } = useGlobalContext();

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    return new Intl.DateTimeFormat('vi-VN', options).format(date);
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const due = dueDate.toDate ? dueDate.toDate() : new Date(dueDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    return due < now && !completed;
  };

  const overdue = isOverdue(dueDate);

  return (
    <Draggable key={id} draggableId={"draggable-" + id} index={index}>
      {(provided, snapshot) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            boxShadow: snapshot.isDragging ? "0 0 5rem #666" : "none",
            opacity: snapshot.isDragging
              ? "1"
              : provided.draggableProps.style.opacity,
            backgroundColor: color,
          }}
          className={`task ${completed ? "task-done" : ""} ${overdue ? "task-overdue" : ""}`}
        >
          <div className="task-content">
            <p>{name}</p>
            {startDate && <span className="task-time">Start: {formatTimestamp(startDate)}</span>}
            {dueDate && <span className="task-time">Due: {formatTimestamp(dueDate)}</span>}
          </div>

          {overdue && (
            <span className="task-overdue-label">
              Quá hạn
            </span>
          )}

          <div className="task-actions">
            <button onClick={() => toggleDone(id)}>
              {completed ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
            </button>
            <button onClick={() => removeTask(id)}>
              <MdDeleteOutline />
            </button>
            <button onClick={() => editTask(id)}>
              <FiEdit />
            </button>
            <button className='btn-colors' onClick={(e) => showColors(e, id)}>
              <MdOutlineColorLens className='preventClick' />
            </button>
          </div>
        </li>
      )}
    </Draggable>
  );
};

export default Task;

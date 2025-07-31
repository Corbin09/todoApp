import React from 'react';
import { useGlobalContext } from '../context/context';

const CreateTaskModal = () => {
  const {
    name,
    setName,
    startDate,
    setStartDate,
    dueDate,
    setDueDate,
    addTask,
    setShowCreateTaskModal,
    showAlert,
  } = useGlobalContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showAlert(true, "Task name cannot be empty!");
      return;
    }
    await addTask();
  };

  const handleCancel = () => {
    setShowCreateTaskModal(false);
    setName('');
    setStartDate('');
    setDueDate('');
  };

  return (
    <div className="modal-overlay">
      <div className="create-task-modal">
        <h3>Create New Task</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="modal-input"
            required
          />
          <label htmlFor="startDate" className="date-label">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="modal-input date-input"
            title="Start Date (optional)"
          />
          <label htmlFor="dueDate" className="date-label">Due Date:</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="modal-input date-input"
            title="Due Date (optional)"
          />
          <div className="modal-buttons">
            <button type="submit" className="modal-btn save-btn">Add Task</button>
            <button type="button" className="modal-btn cancel-btn" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;

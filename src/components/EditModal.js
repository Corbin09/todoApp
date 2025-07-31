import React, { useEffect } from 'react';
import { useGlobalContext } from '../context/context';

const EditModal = () => {
  const {
    isEditModalOpen,
    editId,
    editTaskName,
    setEditTaskName,
    editStartDate,
    setEditStartDate,
    editDueDate,
    setEditDueDate,
    setIsEditModalOpen,
    updateTask,
    showAlert,
    tasks,
  } = useGlobalContext();

  useEffect(() => {
    if (isEditModalOpen && editId) {
      const taskToEdit = tasks.find(task => task.id === editId);
      if (taskToEdit) {
        setEditTaskName(taskToEdit.name);
        setEditStartDate(taskToEdit.startDate ? taskToEdit.startDate.toDate().toISOString().slice(0, 10) : '');
        setEditDueDate(taskToEdit.dueDate ? taskToEdit.dueDate.toDate().toISOString().slice(0, 10) : '');
      }
    }
  }, [isEditModalOpen, editId, tasks, setEditTaskName, setEditStartDate, setEditDueDate]);


  const handleSave = async (e) => {
    e.preventDefault();
    if (!editTaskName.trim()) {
      showAlert(true, "Task name cannot be empty!");
      return;
    }
    await updateTask(editId, editTaskName, editStartDate, editDueDate);
    
    setIsEditModalOpen(false);
    setEditTaskName('');
    setEditStartDate('');
    setEditDueDate('');
  };

  const handleCancel = () => {
    setIsEditModalOpen(false);
    setEditTaskName('');
    setEditStartDate('');
    setEditDueDate('');
  };

  if (!isEditModalOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="edit-modal">
        <h3>Edit Task</h3>
        <form onSubmit={handleSave}>
          <input
            type="text"
            className="edit-input"
            value={editTaskName}
            onChange={(e) => setEditTaskName(e.target.value)}
            required
          />
          <label htmlFor="editStartDate" className="date-label">Start Date:</label>
          <input
            type="date"
            id="editStartDate"
            className="edit-input date-input"
            value={editStartDate}
            onChange={(e) => setEditStartDate(e.target.value)}
          />
          <label htmlFor="editDueDate" className="date-label">Due Date:</label>
          <input
            type="date"
            id="editDueDate"
            className="edit-input date-input"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
          />
          <div className="edit-modal-buttons">
            <button type="submit" className="edit-btn save-btn">Save</button>
            <button type="button" className="edit-btn cancel-btn" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;

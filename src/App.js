import { DragDropContext } from "react-beautiful-dnd";
import List from "./components/List";
import Alert from "./components/Alert";
import Colors from "./components/Colors";
import EditModal from "./components/EditModal";
import CreateTaskModal from "./components/CreateTaskModal";
import AuthPage from "./components/AuthPage";
import { useGlobalContext } from "./context/context";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import React from 'react';
import { MdLogout } from 'react-icons/md';

const App = () => {
  const {
    tasks,
    setTasks,
    alert,
    showAlert,
    filter,
    setFilter,
    isColorsOpen,
    setIsColorsOpen,
    showConfirmDelete,
    confirmRemoveTask,
    cancelRemoveTask,
    isEditModalOpen,
    showCreateTaskModal,
    setShowCreateTaskModal,
    currentUser,
    userProfile,
    isLoading,
    logout,
  } = useGlobalContext();

  const filterTasks = (e) => {
    setFilter(e.target.dataset["filter"]);
  };

  const deleteAll = async () => {
    if (!currentUser) {
      showAlert(true, "Please log in to delete all tasks.");
      return;
    }
    const confirmClearAll = window.confirm("Are you sure you want to delete all tasks? This action cannot be undone.");
    if (confirmClearAll) {
      const querySnapshot = await getDocs(collection(db, `users/${currentUser.uid}/tasks`));
      const deletePromises = querySnapshot.docs.map((task) =>
        deleteDoc(doc(db, `users/${currentUser.uid}/tasks`, task.id))
      );
      await Promise.all(deletePromises);
      showAlert(true, "All tasks deleted.");
    }
  };

  const handleDragEnd = (param) => {
    const srcI = param.source.index;
    const desI = param.destination?.index;
    if (desI === undefined || desI === null || srcI === desI) {
      return;
    }
    const reOrdered = [...tasks];
    const [movedItem] = reOrdered.splice(srcI, 1);
    reOrdered.splice(desI, 0, movedItem);
    setTasks(reOrdered);
  };

  const hideColorsContainer = (e) => {
    if (e.target.classList.contains("btn-colors")) return;
    setIsColorsOpen(false);
  };
  
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!currentUser) {
    return (
      <>
        {alert && <Alert msg={alert.msg} />}
        <AuthPage />
      </>
    );
  }

  return (
    <>
      <div className="top-bar-container">
        <h1 className="user-info">
          Hi, {userProfile?.displayName || currentUser.email}
        </h1>
        <button className="btn-logout" onClick={logout} title="Sign Out">
          <MdLogout />
        </button>
      </div>

      <div className="container" onClick={hideColorsContainer}>
        {isColorsOpen && <Colors />}
        {alert && <Alert msg={alert.msg} />}

        {showConfirmDelete && (
          <div className="confirm-modal-overlay">
            <div className="confirm-modal">
              <p>Are you sure you want to delete this task?</p>
              <div className="confirm-modal-buttons">
                <button className="confirm-btn yes" onClick={confirmRemoveTask}>Yes</button>
                <button className="confirm-btn no" onClick={cancelRemoveTask}>No</button>
              </div>
            </div>
          </div>
        )}

        {isEditModalOpen && <EditModal />}
        {showCreateTaskModal && <CreateTaskModal />}

        <div className="app-header">
            <h1 className="main-title">My Todo List</h1>
            <button
                className="add-task-btn-main"
                onClick={() => setShowCreateTaskModal(true)}
            >
                Add New Task
            </button>
        </div>

        <div className="filter">
            <button
                data-filter="uncompleted"
                className={filter === "uncompleted" ? "active" : ""}
                onClick={filterTasks}
            >
                To-Do
            </button>
            <button
                data-filter="completed"
                className={filter === "completed" ? "active" : ""}
                onClick={filterTasks}
            >
                Finished
            </button>
            <button
                data-filter="all"
                className={filter === "all" ? "active" : ""}
                onClick={filterTasks}
            >
                All Tasks
            </button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          {tasks.length > 0 ? (
            <List />
          ) : (
            <p className="no-tasks">Your list is clear!</p>
          )}
        </DragDropContext>

        {tasks.length > 2 && (
          <button
            className="btn-delete-all"
            onClick={deleteAll}
            title="Delete All Tasks (Completed and Uncompleted)!"
          >
            Clear All
          </button>
        )}
      </div>
    </>
  );
};

export default App;
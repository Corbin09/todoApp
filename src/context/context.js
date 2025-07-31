import React, { useContext, useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const AppContext = React.createContext();

export const AppProvider = ({ children }) => {
  const inputRef = useRef(null);
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState("");
  const [alert, setAlert] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("uncompleted");
  const [isColorsOpen, setIsColorsOpen] = useState(false);
  const [location, setLocation] = useState({});
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [editTaskName, setEditTaskName] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const profileUnsubscribe = onSnapshot(doc(db, "users", user.uid), (docSnapshot) => {
          if (docSnapshot.exists()) {
            setUserProfile(docSnapshot.data());
          } else {
            setUserProfile(null);
          }
        });
        setIsLoading(false);
        return () => profileUnsubscribe();
      } else {
        setUserProfile(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      return;
    }
    const unsubscribeTasks = onSnapshot(collection(db, `users/${currentUser.uid}/tasks`), (snapshot) => {
      const taskList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskList);
    });

    return () => unsubscribeTasks();
  }, [currentUser]);

  const showAlert = (show, msg) => {
    setAlert({ show, msg });
    setTimeout(() => setAlert(null), 3000);
  };
  
  const addTask = async () => {
    if (!currentUser) {
      showAlert(true, "Please log in to add a task.");
      return;
    }
    const newTask = {
      name: name.trim(),
      completed: false,
      color: "#2E8B57",
      createdAt: new Date(),
      startDate: startDate ? new Date(startDate) : null,
      dueDate: dueDate ? new Date(dueDate) : null,
    };
    try {
      if (!newTask.name) {
        showAlert(true, "Task name cannot be empty!");
        return;
      }
      await addDoc(collection(db, `users/${currentUser.uid}/tasks`), newTask);
      setName("");
      setStartDate('');
      setDueDate('');
      showAlert(true, "Task added!");
      setShowCreateTaskModal(false);
    } catch (err) {
      console.error("Failed to add task:", err);
      showAlert(true, "Failed to add task.");
    }
  };

  const prepareRemoveTask = (id) => {
    if (!currentUser) {
      showAlert(true, "Please log in to remove a task.");
      return;
    }
    setTaskToDeleteId(id);
    setShowConfirmDelete(true);
  };

  const confirmRemoveTask = async () => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, `users/${currentUser.uid}/tasks`, taskToDeleteId));
      showAlert(true, "Task removed!");
    } catch (err) {
      console.error("Failed to delete task:", err);
      showAlert(true, "Failed to delete task.");
    } finally {
      setShowConfirmDelete(false);
      setTaskToDeleteId(null);
    }
  };

  const cancelRemoveTask = () => {
    setShowConfirmDelete(false);
    setTaskToDeleteId(null);
  };
  
  const toggleDone = async (id) => {
    if (!currentUser) {
      showAlert(true, "Please log in to update a task.");
      return;
    }
    try {
      const taskRef = doc(db, `users/${currentUser.uid}/tasks`, id);
      const taskToUpdate = tasks.find((task) => task.id === id);
      if (taskToUpdate) {
        await updateDoc(taskRef, { completed: !taskToUpdate.completed });
        showAlert(true, taskToUpdate.completed ? "Task uncompleted!" : "Task completed!");
      }
    } catch (err) {
      console.error("Failed to toggle task completion:", err);
      showAlert(true, "Failed to toggle task completion.");
    }
  };
  
  const editTask = (id) => {
    if (!currentUser) {
      showAlert(true, "Please log in to edit a task.");
      return;
    }
    setIsEditModalOpen(true);
    setEditId(id);
  };

  const showColors = (e, id) => {
    if (!currentUser) {
      showAlert(true, "Please log in to change colors.");
      return;
    }
    const buttonLocation = e.target.getBoundingClientRect();
    const center = (buttonLocation.left + buttonLocation.right) / 2;
    const bottom = buttonLocation.bottom - 30;
    setLocation({ top: bottom, right: center, id: id });
    setIsColorsOpen(true);
  };
  
  const updateTaskColor = async (id, color) => {
    if (!currentUser) return;
    try {
      const taskRef = doc(db, `users/${currentUser.uid}/tasks`, id);
      await updateDoc(taskRef, { color: color });
      showAlert(true, "Task color updated!");
      setIsColorsOpen(false); // ✅ Logic này đã được thêm
    } catch (err) {
      console.error("Failed to update task color:", err);
      showAlert(true, "Failed to update task color.");
    }
  };

  const updateTask = async (id, updatedName, updatedStartDate, updatedDueDate) => {
    if (!currentUser) {
        showAlert(true, "Please log in to update a task.");
        return;
    }
    if (!updatedName || !updatedName.trim()) {
        showAlert(true, "Task name cannot be empty.");
        return;
    }
    try {
        const taskRef = doc(db, `users/${currentUser.uid}/tasks`, id);
        await updateDoc(taskRef, {
            name: updatedName.trim(),
            startDate: updatedStartDate ? new Date(updatedStartDate) : null,
            dueDate: updatedDueDate ? new Date(updatedDueDate) : null,
        });
        showAlert(true, "Task updated successfully!");
    } catch (err) {
        showAlert(true, "Failed to update task.");
        console.error(err);
    }
  };


  const register = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        displayName: name,
        email: email,
      });
      await signOut(auth);
    } catch (error) {
      showAlert(true, error.message);
      throw error;
    }
  };
  
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      showAlert(true, error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      showAlert(true, error.message);
    }
  };

  return (
    <AppContext.Provider
      value={{
        inputRef,
        tasks,
        setTasks,
        name,
        setName,
        alert,
        showAlert,
        isEditing,
        setIsEditing,
        editId,
        setEditId,
        filter,
        setFilter,
        isColorsOpen,
        setIsColorsOpen,
        addTask,
        removeTask: prepareRemoveTask,
        toggleDone,
        editTask,
        showColors,
        location,
        updateTaskColor,
        updateTask,
        showConfirmDelete,
        confirmRemoveTask,
        cancelRemoveTask,
        taskToDeleteId,
        isEditModalOpen,
        setIsEditModalOpen,
        startDate,
        setStartDate,
        dueDate,
        setDueDate,
        showCreateTaskModal,
        setShowCreateTaskModal,
        editTaskName,
        setEditTaskName,
        editStartDate,
        setEditStartDate,
        editDueDate,
        setEditDueDate,
        
        currentUser,
        userProfile,
        isLoading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => useContext(AppContext);
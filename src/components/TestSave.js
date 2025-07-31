import React from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const TestSave = () => {
  const handleSave = async () => {
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        name: "🔥 This is a test task",
        completed: false,
        createdAt: serverTimestamp()
      });
      alert("✅ Saved to Firestore! ID: " + docRef.id);
    } catch (error) {
      console.error("❌ Error saving task:", error);
      alert("❌ Failed to save task.");
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>🚀 Firestore Test</h2>
      <button onClick={handleSave} style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}>
        Save Test Task to Firestore
      </button>
    </div>
  );
};

export default TestSave;

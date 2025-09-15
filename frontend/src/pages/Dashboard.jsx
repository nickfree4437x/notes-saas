import React, { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import NoteForm from "../components/NoteForm";

const Dashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [notes, setNotes] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    setUser(payload);

    api.get("/tenants/me").then((res) => setTenant(res.data));
    api.get("/notes").then((res) => setNotes(res.data));
  }, []);

  const addOrUpdateNote = async () => {
    if (!title || !content) {
      alert("Title and content required");
      return;
    }

    try {
      if (editingNote) {
        // Update note
        const res = await api.put(`/notes/${editingNote._id}`, {
          title,
          content,
        });
        setNotes(
          notes.map((n) => (n._id === editingNote._id ? res.data : n))
        );
        setEditingNote(null);
      } else {
        // Add new note
        const res = await api.post("/notes", { title, content });
        setNotes([...notes, res.data]);
      }
      setTitle("");
      setContent("");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const editNote = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter((n) => n._id !== id));
    } catch (err) {
      alert("Error deleting note");
    }
  };

  const upgrade = async () => {
    try {
      await api.post(`/tenants/${tenant.slug}/upgrade`);
      const updated = await api.get("/tenants/me");
      setTenant(updated.data);
    } catch (err) {
      alert("Upgrade failed");
    }
  };

  const inviteUser = async () => {
    const emailToInvite = prompt("Enter email to invite:");
    if (!emailToInvite) return;
    try {
      await api.post("/users/invite", {
        email: emailToInvite,
        role: "member",
      });
      alert("User invited successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error inviting user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar user={user} tenant={tenant} onLogout={onLogout} />

      <main className="flex-1 p-6">
        {/* Tenant Plan Badge */}
        {tenant && (
          <div className="mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                tenant.plan === "pro" ? "bg-green-600" : "bg-yellow-600"
              }`}
            >
              Current Plan: {tenant.plan.toUpperCase()}
            </span>
          </div>
        )}

        {/* Free Plan Warning */}
        {tenant?.plan === "free" && notes.length >= 3 && (
          <div className="bg-yellow-600 p-3 rounded mb-4 flex justify-between items-center">
            <span>Free plan limit reached! Upgrade to Pro.</span>
            {user?.role === "admin" && (
              <button
                onClick={upgrade}
                className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded"
              >
                Upgrade
              </button>
            )}
          </div>
        )}

        {/* Pro Plan Info */}
        {tenant?.plan === "pro" && (
          <div className="bg-green-700 p-3 rounded mb-4">
            ✅ <span className="font-semibold">Pro Plan: Unlimited notes 🚀</span>
          </div>
        )}

        {/* Invite User (Admin only) */}
        {user?.role === "admin" && (
          <button
            onClick={inviteUser}
            className="mb-4 bg-green-700 hover:bg-green-800 px-4 py-2 rounded"
          >
            Invite User
          </button>
        )}

        {/* Note Form */}
        <NoteForm
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          onSubmit={addOrUpdateNote}
          buttonText={editingNote ? "Update" : "Add"}
          tenant={tenant}
        />

        {/* Notes List */}
        <div className="grid gap-3">
          {notes.map((n) => (
            <NoteCard
              key={n._id}
              note={n}
              onDelete={deleteNote}
              onEdit={editNote}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

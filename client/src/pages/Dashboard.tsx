import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import API from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Loader, Trash2 } from "lucide-react";

interface Note {
  _id: string;
  title: string;
  createdAt: string;
}

interface User {
  name: string;
  email: string;
}

const Dashboard = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchData = async () => {
      try {
        const [notesRes, userRes] = await Promise.all([
          API.get("/notes", { headers: { Authorization: `Bearer ${token}` } }),
          API.get("/user/me", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setNotes(notesRes.data);
        setUser(userRes.data);
      } catch {
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleCreateNote = async () => {
    if (!title.trim()) return toast.error("Title is required");

    setLoading(true);
    try {
      const res = await API.post(
        "/notes",
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes((prev) => [res.data, ...prev]);
      setTitle("");
      toast.success("Note created");
    } catch {
      toast.error("Failed to create note");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prev) => prev.filter((note) => note._id !== id));
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/sign-in");
  };

  return (
    <div className="min-h-screen w-full max-w-3xl mx-auto px-4 py-6 md:px-8 lg:px-10 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Loader className="text-blue-600" />
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
        <button onClick={handleLogout} className="text-blue-600 text-sm font-medium">
          Sign Out
        </button>
      </div>

      {/* Welcome Box */}
      <Card className="shadow-md">
        <CardContent className="py-4">
          <p className="sm:text-xl md:text-2xl font-bold mb-1">
            Welcome, {user?.name || "User"} !
          </p>
          <p className="text-sm text-muted-foreground">Email: {user?.email}</p>
        </CardContent>
      </Card>

      {/* Create Note */}
      <div className="flex flex-col gap-3">
        <Input
          placeholder="Enter note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-gray-400"
        />
        <Button
          onClick={handleCreateNote}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 w-full"
        >
          {loading ? "Creating..." : "Create Note"}
        </Button>
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        <h3 className="text-base font-medium">Notes</h3>
        {notes.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">No notes yet.</p>
        ) : (
          notes.map((note) => (
            <div
              key={note._id}
              className="flex justify-between items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:shadow-md transition-shadow"
            >
              <span className="text-sm font-medium text-gray-800">{note.title}</span>
              <button
                onClick={() => handleDelete(note._id)}
                className="text-gray-600 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;

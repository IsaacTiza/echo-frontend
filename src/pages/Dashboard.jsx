import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, FileText, Image, File, Trash2 } from "lucide-react";
import useAuthStore from "../store/authStore";
import useNoteStore from "../store/noteStore";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

const typeConfig = {
  text: { color: "bg-accent-sage", label: "Text", icon: FileText },
  pdf: { color: "bg-accent-lavender", label: "PDF", icon: File },
  image: { color: "bg-accent-teal", label: "Image", icon: Image },
  docx: { color: "bg-accent-green", label: "Word", icon: FileText },
  txt: { color: "bg-accent-sage", label: "Text", icon: FileText },
};

const Dashboard = () => {
  const { user } = useAuthStore();
  const { notes, isLoading, fetchNotes, deleteNote } = useNoteStore();
  const navigate = useNavigate();

 useEffect(() => {
   const token = searchParams.get("token");
   if (token) {
     setToken(token);
     window.history.replaceState({}, "", "/dashboard");
   }
   fetchNotes();
 }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteNote(id);
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="min-h-dvh bg-muted pb-24">
      {/* Header */}
      <div className="bg-card px-6 pt-14 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div>
            <p className="text-muted-foreground text-sm">{getGreeting()},</p>
            <h1 className="text-2xl font-bold text-foreground">
              {firstName} 👋
            </h1>
          </div>
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-11 h-11 rounded-full object-cover"
            onClick={() => navigate("/settings")}
          />
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex gap-3 mt-5"
        >
          <div className="flex-1 bg-muted rounded-2xl p-4">
            <p className="text-2xl font-bold text-foreground">{notes.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Notes</p>
          </div>
          <div className="flex-1 bg-muted rounded-2xl p-4">
            <p className="text-2xl font-bold text-primary">
              {10 - (user?.dailyUsage || 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">AI Credits Left</p>
          </div>
          <div className="flex-1 bg-muted rounded-2xl p-4">
            <p className="text-2xl font-bold text-foreground">
              {notes.filter((n) => n.explanation).length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Explained</p>
          </div>
        </motion.div>
      </div>

      {/* Quick Action */}
      <div className="px-6 mt-6">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          onClick={() => navigate("/notes/new")}
          className="w-full gradient-primary rounded-2xl p-5 flex items-center justify-between active:scale-95 transition-transform"
        >
          <div>
            <p className="text-white font-bold text-lg">Upload a Note</p>
            <p className="text-white/80 text-sm mt-1">
              PDF, image, text, DOCX, PPTX
            </p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <ChevronRight className="w-6 h-6 text-white" />
          </div>
        </motion.button>
      </div>

      {/* Notes List */}
      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Your Notes</h2>
          <span className="text-sm text-muted-foreground">{notes.length} notes</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-16 h-16 bg-accent-sage rounded-2xl flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-semibold">No notes yet</p>
            <p className="text-muted-foreground text-sm mt-1">
              Upload your first note to get started
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {notes.map((note, i) => {
              const config = typeConfig[note.type] || typeConfig.text;
              const Icon = config.icon;

              return (
                <motion.div
                  key={note._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  onClick={() => navigate(`/notes/${note._id}/mode`)}
                  className="bg-card rounded-2xl p-4 flex items-center gap-4 card-shadow active:scale-95 transition-transform cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 ${config.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className="w-6 h-6 text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {note.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {config.label}
                      </span>
                      {note.explanation && (
                        <>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-xs text-primary font-medium">
                            Explained
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, note._id)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-muted active:scale-95 transition-transform flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      <Navbar />
    </div>
  );
};

export default Dashboard;

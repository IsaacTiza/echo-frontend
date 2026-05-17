import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Image, File, Clock } from "lucide-react";
import useNoteStore from "../store/noteStore";
import Navbar from "../components/Navbar";

const typeConfig = {
  text: { color: "bg-accent-sage", label: "Text", icon: FileText },
  pdf: { color: "bg-accent-lavender", label: "PDF", icon: File },
  image: { color: "bg-accent-teal", label: "Image", icon: Image },
  docx: { color: "bg-accent-green", label: "Word", icon: FileText },
  txt: { color: "bg-accent-sage", label: "Text", icon: FileText },
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const History = () => {
  const { notes, isLoading, fetchNotes } = useNoteStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const grouped = notes.reduce((acc, note) => {
    const date = formatDate(note.createdAt);
    if (!acc[date]) acc[date] = [];
    acc[date].push(note);
    return acc;
  }, {});

  return (
    <div className="min-h-dvh bg-muted pb-24">
      {/* Header */}
      <div className="bg-card px-6 pt-14 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">History</h1>
            <p className="text-xs text-muted-foreground">
              {notes.length} notes uploaded
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-accent-sage rounded-2xl flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">No history yet</p>
            <p className="text-muted-foreground text-sm mt-1">
              Your uploaded notes will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([date, dateNotes], groupIndex) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
              >
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {date}
                </p>
                <div className="space-y-3">
                  {dateNotes.map((note, i) => {
                    const config = typeConfig[note.type] || typeConfig.text;
                    const Icon = config.icon;
                    return (
                      <motion.div
                        key={note._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
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
                            {note.tags?.length > 0 && (
                              <>
                                <span className="text-muted-foreground">·</span>
                                <span className="text-xs text-muted-foreground">
                                  #{note.tags[0]}
                                </span>
                              </>
                            )}
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
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Navbar />
    </div>
  );
};

export default History;

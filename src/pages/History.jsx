import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Image, File, Clock } from "lucide-react";
import useNoteStore from "../store/noteStore";
import Navbar from "../components/Navbar";

const typeConfig = {
  text: { color: "bg-[#ECEDC7]", label: "Text", icon: FileText },
  pdf: { color: "bg-[#DED1E8]", label: "PDF", icon: File },
  image: { color: "bg-[#D2E4E2]", label: "Image", icon: Image },
  docx: { color: "bg-[#D9E7CB]", label: "Word", icon: FileText },
  pptx: { color: "bg-[#DED1E8]", label: "Slides", icon: File },
  txt: { color: "bg-[#ECEDC7]", label: "Text", icon: FileText },
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

  // Group notes by date
  const grouped = notes.reduce((acc, note) => {
    const date = formatDate(note.createdAt);
    if (!acc[date]) acc[date] = [];
    acc[date].push(note);
    return acc;
  }, {});

  return (
    <div className="min-h-dvh bg-[#F5F5F4] pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-14 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1C1B19]">History</h1>
            <p className="text-xs text-[#78716C]">
              {notes.length} notes uploaded
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#F95E08] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-[#ECEDC7] rounded-2xl flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-[#78716C]" />
            </div>
            <p className="font-semibold text-[#1C1B19]">No history yet</p>
            <p className="text-[#78716C] text-sm mt-1">
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
                <p className="text-xs font-semibold text-[#78716C] uppercase tracking-wider mb-3">
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
                        className="bg-white rounded-2xl p-4 flex items-center gap-4 card-shadow active:scale-95 transition-transform cursor-pointer"
                      >
                        <div
                          className={`w-12 h-12 ${config.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className="w-6 h-6 text-[#1C1B19]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#1C1B19] truncate">
                            {note.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-[#78716C]">
                              {config.label}
                            </span>
                            {note.tags?.length > 0 && (
                              <>
                                <span className="text-[#78716C]">·</span>
                                <span className="text-xs text-[#78716C]">
                                  #{note.tags[0]}
                                </span>
                              </>
                            )}
                            {note.explanation && (
                              <>
                                <span className="text-[#78716C]">·</span>
                                <span className="text-xs text-[#F95E08] font-medium">
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

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Brain, Zap } from "lucide-react";
import useNoteStore from "../store/noteStore";

const ModeSelect = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentNote, fetchNote, isLoading } = useNoteStore();

  useEffect(() => {
    fetchNote(id);
  }, [id]);

  return (
    <div className="min-h-dvh bg-background px-6 pt-14 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">Selected Note</p>
          <h1 className="text-lg font-bold text-foreground truncate">
            {isLoading ? "Loading..." : currentNote?.title}
          </h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-foreground mb-2">
          How do you want to study?
        </h2>
        <p className="text-muted-foreground text-sm mb-8">
          Choose a mode to get started with your note.
        </p>

        <div className="space-y-4">
          {/* Understand Mode */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            onClick={() => navigate(`/notes/${id}/explain`)}
            className="w-full text-left gradient-primary rounded-2xl p-6 active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Understand</h3>
            <p className="text-white/80 text-sm">
              Get a clear AI explanation of your note in your preferred tone.
              Perfect for when the material feels confusing.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["Simple", "Detailed", "ELI5", "Academic", "Bullets"].map(
                (t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium"
                  >
                    {t}
                  </span>
                ),
              )}
            </div>
          </motion.button>

          {/* Study Mode */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            onClick={() => navigate(`/notes/${id}/study`)}
            className="w-full text-left bg-[#1C1B19] dark:bg-[#2C2B28] rounded-2xl p-6 active:scale-95 transition-transform"
          >
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Study</h3>
            <p className="text-white/80 text-sm">
              Test yourself with flashcards or a quiz generated from your note.
              See how much you actually know.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["Flashcards", "MCQ Quiz", "12 Questions"].map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ModeSelect;

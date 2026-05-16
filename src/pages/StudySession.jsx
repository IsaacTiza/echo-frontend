import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import useNoteStore from "../store/noteStore";
import api from "../lib/api";
import toast from "react-hot-toast";

const StudySession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentNote, fetchNote } = useNoteStore();

  const [mode, setMode] = useState(null); // "flashcards" or "quiz"
  const [isLoading, setIsLoading] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [flipped, setFlipped] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
    const [direction, setDirection] = useState(1);
    const [questionCount, setQuestionCount] = useState(12);

  useEffect(() => {
    fetchNote(id);
  }, [id]);

const handleModeSelect = async (selectedMode) => {
  setMode(selectedMode);
  setIsLoading(true);
  try {
    if (selectedMode === "flashcards") {
      const res = await api.post(`/ai/flashcards/${id}`);
      setFlashcards(res.data.flashcards);
    } else {
      const res = await api.post(`/ai/quiz/${id}`, { count: questionCount });
      setQuiz(res.data.quiz);
    }
  } catch (error) {
    const msg = error.response?.data?.message;
    toast.error(
      msg?.includes("Daily limit") ? msg : "Failed to generate study content",
    );
    setMode(null);
  } finally {
    setIsLoading(false);
  }
};

  const handleNextCard = () => {
    if (cardIndex < flashcards.length - 1) {
      setDirection(1);
      setFlipped(false);
      setTimeout(() => setCardIndex(cardIndex + 1), 150);
    }
  };

  const handlePrevCard = () => {
    if (cardIndex > 0) {
      setDirection(-1);
      setFlipped(false);
      setTimeout(() => setCardIndex(cardIndex - 1), 150);
    }
  };

  const handleAnswer = (option) => {
    if (selected) return;
    setSelected(option);
    const current = quiz[quizIndex];
    setAnswers([
      ...answers,
      {
        question: current.question,
        selected: option,
        correct: current.answer,
        isCorrect: option === current.answer,
        explanation: current.explanation,
      },
    ]);
  };

  const handleNextQuestion = () => {
    if (quizIndex < quiz.length - 1) {
      setQuizIndex(quizIndex + 1);
      setSelected(null);
    } else {
      // Quiz finished
      navigate(`/notes/${id}/results`, {
        state: { answers, noteId: id },
      });
    }
  };

  // Mode Selection Screen
  // Mode Selection Screen
  if (!mode) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: "#fff",
          fontFamily: "Onest Variable, sans-serif",
          padding: "56px 24px 40px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 32,
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "#F5F5F4",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowLeft size={20} color="#1C1B19" />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 11, color: "#78716C", margin: 0 }}>
              Study Mode
            </p>
            <h1
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#1C1B19",
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {currentNote?.title}
            </h1>
          </div>
        </div>

        <h2
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "#1C1B19",
            margin: "0 0 8px",
          }}
        >
          Pick a study method
        </h2>
        <p style={{ color: "#78716C", fontSize: 14, margin: "0 0 32px" }}>
          Both are generated fresh from your note every time.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => handleModeSelect("flashcards")}
            style={{
              width: "100%",
              textAlign: "left",
              background: "#ECEDC7",
              borderRadius: 24,
              padding: 24,
              border: "none",
              cursor: "pointer",
            }}
          >
            <p style={{ fontSize: 32, margin: "0 0 12px" }}>🃏</p>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#1C1B19",
                margin: "0 0 6px",
              }}
            >
              Flashcards
            </h3>
            <p style={{ color: "#78716C", fontSize: 14, margin: 0 }}>
              Flip through key terms and definitions. Great for memorization.
            </p>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setMode("quiz-setup")}
            style={{
              width: "100%",
              textAlign: "left",
              background: "#DED1E8",
              borderRadius: 24,
              padding: 24,
              border: "none",
              cursor: "pointer",
            }}
          >
            <p style={{ fontSize: 32, margin: "0 0 12px" }}>📝</p>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#1C1B19",
                margin: "0 0 6px",
              }}
            >
              MCQ Quiz
            </h3>
            <p style={{ color: "#78716C", fontSize: 14, margin: 0 }}>
              Multiple choice questions to test your understanding.
            </p>
          </motion.button>
        </div>
      </div>
    );
  }

  // Quiz Setup Screen
  if (mode === "quiz-setup") {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: "#fff",
          fontFamily: "Onest Variable, sans-serif",
          padding: "56px 24px 40px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 32,
          }}
        >
          <button
            onClick={() => setMode(null)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "#F5F5F4",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowLeft size={20} color="#1C1B19" />
          </button>
          <h1
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#1C1B19",
              margin: 0,
            }}
          >
            Quiz Setup
          </h1>
        </div>

        <h2
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#1C1B19",
            margin: "0 0 8px",
          }}
        >
          How many questions?
        </h2>
        <p style={{ color: "#78716C", fontSize: 14, margin: "0 0 32px" }}>
          Choose how long your quiz should be.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 32,
          }}
        >
          {[5, 10, 12, 15, 20, 25].map((num) => (
            <button
              key={num}
              onClick={() => setQuestionCount(num)}
              style={{
                padding: "20px 16px",
                borderRadius: 20,
                border: "none",
                cursor: "pointer",
                background:
                  questionCount === num
                    ? "linear-gradient(135deg, #F95E08, #FE8118)"
                    : "#F5F5F4",
                color: questionCount === num ? "white" : "#1C1B19",
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              {num}
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  margin: "4px 0 0",
                  opacity: 0.8,
                }}
              >
                questions
              </p>
            </button>
          ))}
        </div>

        <button
          onClick={() => handleModeSelect("quiz")}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #F95E08, #FE8118)",
            padding: 16,
            borderRadius: 16,
            border: "none",
            cursor: "pointer",
            color: "white",
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          Start Quiz →
        </button>
      </div>
    );
  }
  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-dvh bg-white flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#F95E08] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#78716C] text-sm">
          {mode === "flashcards"
            ? "Generating flashcards..."
            : "Building your quiz..."}
        </p>
      </div>
    );
  }

  // Flashcard Mode
  if (mode === "flashcards" && flashcards.length > 0) {
    const card = flashcards[cardIndex];
    return (
      <div className="min-h-dvh bg-[#F5F5F4] px-6 pt-14 pb-10">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => {
              setMode(null);
              setCardIndex(0);
              setFlipped(false);
            }}
            className="w-10 h-10 rounded-xl bg-white flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-[#1C1B19]" />
          </button>
          <div className="flex-1">
            <p className="text-xs text-[#78716C]">Flashcards</p>
            <p className="text-sm font-bold text-[#1C1B19]">
              {cardIndex + 1} of {flashcards.length}
            </p>
          </div>
          <button
            onClick={() => {
              setCardIndex(0);
              setFlipped(false);
            }}
            className="w-10 h-10 rounded-xl bg-white flex items-center justify-center"
          >
            <RotateCcw className="w-5 h-5 text-[#78716C]" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white rounded-full mb-8">
          <motion.div
            className="h-full gradient-primary rounded-full"
            animate={{
              width: `${((cardIndex + 1) / flashcards.length) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Flashcard */}
        <motion.div
          key={cardIndex}
          initial={{ opacity: 0, x: direction * 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setFlipped(!flipped)}
          className="w-full min-h-64 bg-white rounded-3xl p-8 flex flex-col items-center justify-center text-center card-shadow cursor-pointer active:scale-95 transition-transform"
        >
          <AnimatePresence mode="wait">
            {!flipped ? (
              <motion.div
                key="term"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-xs text-[#78716C] uppercase tracking-wider mb-4">
                  Term
                </p>
                <p className="text-2xl font-bold text-[#1C1B19]">{card.term}</p>
                <p className="text-xs text-[#78716C] mt-6">
                  Tap to reveal definition
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="definition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-xs text-[#F95E08] uppercase tracking-wider mb-4 font-semibold">
                  Definition
                </p>
                <p className="text-base text-[#1C1B19] leading-relaxed">
                  {card.definition}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handlePrevCard}
            disabled={cardIndex === 0}
            className="flex-1 py-4 rounded-2xl bg-white text-[#1C1B19] font-semibold disabled:opacity-40 active:scale-95 transition-transform"
          >
            ← Previous
          </button>
          <button
            onClick={handleNextCard}
            disabled={cardIndex === flashcards.length - 1}
            className="flex-1 py-4 rounded-2xl gradient-primary text-white font-semibold disabled:opacity-40 active:scale-95 transition-transform"
          >
            Next →
          </button>
        </div>
      </div>
    );
  }

  // Quiz Mode
  if (mode === "quiz" && quiz.length > 0) {
    const current = quiz[quizIndex];
    return (
      <div className="min-h-dvh bg-white px-6 pt-14 pb-10">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => {
              setMode(null);
              setQuizIndex(0);
              setSelected(null);
              setAnswers([]);
            }}
            className="w-10 h-10 rounded-xl bg-[#F5F5F4] flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-[#1C1B19]" />
          </button>
          <div className="flex-1">
            <p className="text-xs text-[#78716C]">Quiz</p>
            <p className="text-sm font-bold text-[#1C1B19]">
              Question {quizIndex + 1} of {quiz.length}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-[#F5F5F4] rounded-full mb-8">
          <motion.div
            className="h-full gradient-primary rounded-full"
            animate={{ width: `${((quizIndex + 1) / quiz.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Question */}
        <motion.div
          key={quizIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-[#F5F5F4] rounded-2xl p-5 mb-6">
            <p className="text-base font-semibold text-[#1C1B19] leading-relaxed">
              {current.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {current.options.map((option) => {
              const isSelected = selected === option;
              const isCorrect = option === current.answer;
              const showResult = !!selected;

              let style = "bg-[#F5F5F4] text-[#1C1B19]";
              if (showResult && isCorrect) style = "bg-[#22C55E] text-white";
              else if (showResult && isSelected && !isCorrect)
                style = "bg-[#EF4444] text-white";

              return (
                <motion.button
                  key={option}
                  whileTap={{ scale: selected ? 1 : 0.97 }}
                  onClick={() => handleAnswer(option)}
                  className={`w-full text-left px-5 py-4 rounded-2xl font-medium text-sm transition-colors ${style}`}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-[#F5F5F4] rounded-2xl p-4"
            >
              <p className="text-xs font-semibold text-[#78716C] mb-1">
                Explanation
              </p>
              <p className="text-sm text-[#1C1B19] leading-relaxed">
                {current.explanation}
              </p>
            </motion.div>
          )}

          {/* Next Button */}
          {selected && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleNextQuestion}
              className="w-full mt-4 gradient-primary py-4 rounded-2xl text-white font-bold active:scale-95 transition-transform"
            >
              {quizIndex < quiz.length - 1
                ? "Next Question →"
                : "See Results →"}
            </motion.button>
          )}
        </motion.div>
      </div>
    );
  }

  return null;
};;

export default StudySession;

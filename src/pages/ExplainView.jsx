import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import useNoteStore from "../store/noteStore";
import api from "../lib/api";
import toast from "react-hot-toast";

const tones = [
  { value: "simple", label: "Simple" },
  { value: "detailed", label: "Detailed" },
  { value: "eli5", label: "ELI5" },
  { value: "academic", label: "Academic" },
  { value: "bullet", label: "Bullets" },
];

const ExplainView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentNote, fetchNote } = useNoteStore();

  const [explanation, setExplanation] = useState("");
  const [tone, setTone] = useState("simple");
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const note = await fetchNote(id);
        if (note?.tone) setTone(note.tone);
        if (note?.explanation) {
          setExplanation(note.explanation);
          setHasLoaded(true);
        } else {
          await handleExplain(note?.tone || "simple");
        }
      } catch {
        toast.error("Failed to load note");
      }
    };
    load();
  }, [id]);

  const handleExplain = async (selectedTone) => {
    setIsLoading(true);
    setExplanation("");
    try {
      const res = await api.post(`/ai/explain/${id}`, {
        tone: selectedTone || tone,
      });
      setExplanation(res.data.explanation);
      setHasLoaded(true);
    } catch (error) {
      const msg = error.response?.data?.message;
      toast.error(
        msg?.includes("Daily limit") ? msg : "Failed to generate explanation",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToneChange = (newTone) => {
    setTone(newTone);
    handleExplain(newTone);
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#fff",
        fontFamily: "Onest Variable, sans-serif",
        paddingBottom: 40,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "56px 24px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
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
            Understand
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
        {hasLoaded && (
          <button
            onClick={() => handleExplain(tone)}
            disabled={isLoading}
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
            <RefreshCw
              size={20}
              color="#1C1B19"
              style={{
                animation: isLoading ? "spin 1s linear infinite" : "none",
              }}
            />
          </button>
        )}
      </div>

      {/* Tone Selector */}
      <div
        style={{
          padding: "0 24px 20px",
          display: "flex",
          gap: 8,
          overflowX: "auto",
        }}
      >
        {tones.map((t) => (
          <button
            key={t.value}
            onClick={() => handleToneChange(t.value)}
            disabled={isLoading}
            style={{
              flexShrink: 0,
              padding: "8px 16px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
              background:
                tone === t.value
                  ? "linear-gradient(135deg, #F95E08, #FE8118)"
                  : "#F5F5F4",
              color: tone === t.value ? "white" : "#78716C",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "0 24px" }}>
        {isLoading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 0",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                border: "4px solid #F5F5F4",
                borderTop: "4px solid #F95E08",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <p style={{ color: "#78716C", fontSize: 14 }}>
              Echo is reading your note...
            </p>
          </div>
        ) : explanation ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              style={{ background: "#F5F5F4", borderRadius: 20, padding: 20 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #F95E08, #FE8118)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BookOpen size={16} color="white" />
                </div>
                <span
                  style={{ fontWeight: 700, fontSize: 14, color: "#1C1B19" }}
                >
                  Echo's Explanation
                </span>
              </div>
              <div style={{ fontSize: 14, color: "#1C1B19", lineHeight: 1.7 }}>
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1
                        style={{
                          fontSize: 20,
                          fontWeight: 800,
                          color: "#1C1B19",
                          margin: "16px 0 8px",
                        }}
                      >
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2
                        style={{
                          fontSize: 17,
                          fontWeight: 700,
                          color: "#1C1B19",
                          margin: "14px 0 6px",
                        }}
                      >
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#F95E08",
                          margin: "12px 0 6px",
                        }}
                      >
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p
                        style={{
                          margin: "8px 0",
                          lineHeight: 1.7,
                          color: "#1C1B19",
                        }}
                      >
                        {children}
                      </p>
                    ),
                    strong: ({ children }) => (
                      <strong style={{ fontWeight: 700, color: "#1C1B19" }}>
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em style={{ color: "#78716C", fontStyle: "italic" }}>
                        {children}
                      </em>
                    ),
                    ul: ({ children }) => (
                      <ul style={{ margin: "8px 0", paddingLeft: 20 }}>
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol style={{ margin: "8px 0", paddingLeft: 20 }}>
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li
                        style={{
                          margin: "4px 0",
                          color: "#1C1B19",
                          lineHeight: 1.6,
                        }}
                      >
                        {children}
                      </li>
                    ),
                    hr: () => (
                      <hr
                        style={{
                          border: "none",
                          borderTop: "1px solid #E7E5E4",
                          margin: "16px 0",
                        }}
                      />
                    ),
                    blockquote: ({ children }) => (
                      <blockquote
                        style={{
                          borderLeft: "3px solid #F95E08",
                          paddingLeft: 12,
                          margin: "12px 0",
                          color: "#78716C",
                        }}
                      >
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {explanation}
                </ReactMarkdown>
              </div>
            </div>
            <button
              onClick={() => navigate(`/notes/${id}/study`)}
              style={{
                width: "100%",
                marginTop: 16,
                background: "#1C1B19",
                padding: "16px",
                borderRadius: 16,
                border: "none",
                cursor: "pointer",
                color: "white",
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              Test Yourself →
            </button>
          </motion.div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 0",
              gap: 16,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: "linear-gradient(135deg, #F95E08, #FE8118)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BookOpen size={32} color="white" />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 18, color: "#1C1B19" }}>
                Ready to explain
              </p>
              <p style={{ color: "#78716C", fontSize: 14, marginTop: 4 }}>
                Pick a tone above to get started
              </p>
            </div>
            <button
              onClick={() => handleExplain(tone)}
              style={{
                background: "linear-gradient(135deg, #F95E08, #FE8118)",
                padding: "14px 32px",
                borderRadius: 16,
                border: "none",
                cursor: "pointer",
                color: "white",
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              Explain This Note
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ExplainView;

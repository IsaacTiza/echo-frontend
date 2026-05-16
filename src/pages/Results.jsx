import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import api from "../lib/api";
import toast from "react-hot-toast";

const MarkdownContent = ({ content }) => (
  <ReactMarkdown
    components={{
      h1: ({ children }) => (
        <h1
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: "#1C1B19",
            margin: "12px 0 6px",
          }}
        >
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#1C1B19",
            margin: "10px 0 4px",
          }}
        >
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#F95E08",
            margin: "8px 0 4px",
          }}
        >
          {children}
        </h3>
      ),
      p: ({ children }) => (
        <p
          style={{
            margin: "6px 0",
            lineHeight: 1.7,
            color: "#1C1B19",
            fontSize: 14,
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
      ul: ({ children }) => (
        <ul style={{ margin: "6px 0", paddingLeft: 18 }}>{children}</ul>
      ),
      ol: ({ children }) => (
        <ol style={{ margin: "6px 0", paddingLeft: 18 }}>{children}</ol>
      ),
      li: ({ children }) => (
        <li
          style={{
            margin: "3px 0",
            color: "#1C1B19",
            lineHeight: 1.6,
            fontSize: 14,
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
            margin: "12px 0",
          }}
        />
      ),
    }}
  >
    {content}
  </ReactMarkdown>
);

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { answers = [] } = state || {};

  const [failedExplanation, setFailedExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const correct = answers.filter((a) => a.isCorrect).length;
  const total = answers.length;
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;
  const failed = answers.filter((a) => !a.isCorrect);
  const passed = failed.length === 0;

  useEffect(() => {
    if (!passed && failed.length > 0) {
      fetchFailedExplanation();
    }
  }, []);

  const fetchFailedExplanation = async () => {
    setIsLoading(true);
    try {
      const failedTopics = failed.map((a) => a.question);
      const res = await api.post(`/ai/explain-failed/${id}`, { failedTopics });
      setFailedExplanation(res.data.explanation);
    } catch (error) {
      const msg = error.response?.data?.message;
      toast.error(msg?.includes("Daily limit") ? msg : "Could not load review");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreMessage = () => {
    if (score === 100) return "Perfect score! 🎉";
    if (score >= 80) return "Great job! 🔥";
    if (score >= 50) return "Good effort! 💪";
    return "Keep studying! 📚";
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
          onClick={() => navigate("/dashboard")}
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
          style={{ fontSize: 18, fontWeight: 700, color: "#1C1B19", margin: 0 }}
        >
          Quiz Results
        </h1>
      </div>

      <div style={{ padding: "0 24px" }}>
        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: "linear-gradient(135deg, #F95E08, #FE8118)",
            borderRadius: 24,
            padding: 32,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: 13,
              margin: "0 0 4px",
            }}
          >
            Your Score
          </p>
          <p
            style={{
              color: "white",
              fontSize: 72,
              fontWeight: 800,
              margin: 0,
              lineHeight: 1,
            }}
          >
            {score}%
          </p>
          <p
            style={{
              color: "white",
              fontWeight: 600,
              fontSize: 16,
              margin: "8px 0 0",
            }}
          >
            {getScoreMessage()}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 32,
              marginTop: 20,
            }}
          >
            {[
              { label: "Correct", value: correct },
              { label: "Wrong", value: failed.length },
              { label: "Total", value: total },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <p
                  style={{
                    color: "white",
                    fontSize: 24,
                    fontWeight: 800,
                    margin: 0,
                  }}
                >
                  {s.value}
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: 11,
                    margin: "2px 0 0",
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Passed */}
        {passed && (
          <div
            style={{
              background: "#ECEDC7",
              borderRadius: 20,
              padding: 20,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            <p style={{ fontSize: 28, margin: "0 0 8px" }}>🎯</p>
            <p style={{ fontWeight: 700, color: "#1C1B19", margin: 0 }}>
              You passed everything!
            </p>
            <p style={{ color: "#78716C", fontSize: 13, margin: "4px 0 0" }}>
              Try again for different questions.
            </p>
          </div>
        )}

        {/* Failed Explanation */}
        {!passed && (
          <div style={{ marginBottom: 20 }}>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#1C1B19",
                margin: "0 0 12px",
              }}
            >
              Areas to Review
            </h2>
            {isLoading ? (
              <div
                style={{
                  background: "#F5F5F4",
                  borderRadius: 20,
                  padding: 32,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    border: "4px solid #F5F5F4",
                    borderTop: "4px solid #F95E08",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <p style={{ color: "#78716C", fontSize: 13, margin: 0 }}>
                  Echo is reviewing your mistakes...
                </p>
              </div>
            ) : failedExplanation ? (
              <div
                style={{ background: "#F5F5F4", borderRadius: 20, padding: 20 }}
              >
                <MarkdownContent content={failedExplanation} />
              </div>
            ) : null}
          </div>
        )}

        {/* Answer Breakdown */}
        <div style={{ marginBottom: 20 }}>
          <h2
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#1C1B19",
              margin: "0 0 12px",
            }}
          >
            Answer Breakdown
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {answers.map((answer, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{
                  background: "#F5F5F4",
                  borderRadius: 16,
                  padding: 16,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                {answer.isCorrect ? (
                  <CheckCircle
                    size={20}
                    color="#22C55E"
                    style={{ flexShrink: 0, marginTop: 2 }}
                  />
                ) : (
                  <XCircle
                    size={20}
                    color="#EF4444"
                    style={{ flexShrink: 0, marginTop: 2 }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#1C1B19",
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {answer.question}
                  </p>
                  {!answer.isCorrect && (
                    <p
                      style={{
                        fontSize: 12,
                        color: "#22C55E",
                        margin: "4px 0 0",
                        fontWeight: 600,
                      }}
                    >
                      ✓ {answer.correct}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button
            onClick={() => navigate(`/notes/${id}/study`)}
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
            Try Again
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              width: "100%",
              background: "#F5F5F4",
              padding: 16,
              borderRadius: 16,
              border: "none",
              cursor: "pointer",
              color: "#1C1B19",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Results;

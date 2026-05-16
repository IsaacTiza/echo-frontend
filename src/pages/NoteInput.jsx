import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, FileText, X, File, Image } from "lucide-react";
import useNoteStore from "../store/noteStore";
import toast from "react-hot-toast";

const tones = [
  { value: "simple", label: "Simple", desc: "Easy to understand" },
  { value: "detailed", label: "Detailed", desc: "In-depth explanation" },
  { value: "eli5", label: "ELI5", desc: "Like I'm 5 years old" },
  { value: "academic", label: "Academic", desc: "Formal and structured" },
  { value: "bullet", label: "Bullets", desc: "Key points only" },
];

const acceptedTypes = ".pdf,.docx,.pptx,.txt,.jpg,.jpeg,.png,.webp";

const getFileIcon = (file) => {
  if (!file) return null;
  if (file.type.includes("image")) return Image;
  if (file.type.includes("pdf")) return File;
  return FileText;
};

const NoteInput = () => {
  const navigate = useNavigate();
  const { createNote, isLoading } = useNoteStore();
  const fileRef = useRef(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tone, setTone] = useState("simple");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [file, setFile] = useState(null);
  const [inputType, setInputType] = useState("text"); // "text" or "file"

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10MB");
      return;
    }

    setFile(selected);
    setInputType("file");
    setContent("");
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      if (tags.length >= 5) {
        toast.error("Maximum 5 tags allowed");
        return;
      }
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please add a title");
      return;
    }

    if (!file && !content.trim()) {
      toast.error("Please add content or upload a file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("tone", tone);
      formData.append("tags", JSON.stringify(tags));

      if (file) {
        formData.append("file", file);
      } else {
        formData.append("content", content);
      }

      const note = await createNote(formData);
      toast.success("Note created!");
      navigate(`/notes/${note._id}/mode`);
    } catch {
      toast.error("Failed to create note");
    }
  };

  const FileIcon = getFileIcon(file);

  return (
    <div className="min-h-dvh bg-white pb-10">
      {/* Header */}
      <div className="px-6 pt-14 pb-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-xl bg-[#F5F5F4] flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 text-[#1C1B19]" />
        </button>
        <h1 className="text-xl font-bold text-[#1C1B19]">New Note</h1>
      </div>

      <div className="px-6 space-y-6">
        {/* Title */}
        <div>
          <label className="text-sm font-semibold text-[#1C1B19] mb-2 block">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Cell Biology - Chapter 3"
            className="w-full px-4 py-4 rounded-2xl bg-[#F5F5F4] text-[#1C1B19] placeholder:text-[#78716C] text-base outline-none focus:ring-2 focus:ring-[#F95E08] transition"
          />
        </div>

        {/* Input Type Toggle */}
        <div>
          <label className="text-sm font-semibold text-[#1C1B19] mb-2 block">
            Note Content
          </label>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => {
                setInputType("text");
                setFile(null);
              }}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition ${
                inputType === "text"
                  ? "gradient-primary text-white"
                  : "bg-[#F5F5F4] text-[#78716C]"
              }`}
            >
              Type Text
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition ${
                inputType === "file"
                  ? "gradient-primary text-white"
                  : "bg-[#F5F5F4] text-[#78716C]"
              }`}
            >
              Upload File
            </button>
          </div>

          {inputType === "text" ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste or type your notes here..."
              rows={6}
              className="w-full px-4 py-4 rounded-2xl bg-[#F5F5F4] text-[#1C1B19] placeholder:text-[#78716C] text-base outline-none focus:ring-2 focus:ring-[#F95E08] transition resize-none"
            />
          ) : file ? (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#F5F5F4]">
              <div className="w-12 h-12 bg-[#ECEDC7] rounded-xl flex items-center justify-center flex-shrink-0">
                {FileIcon && <FileIcon className="w-6 h-6 text-[#1C1B19]" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#1C1B19] truncate">
                  {file.name}
                </p>
                <p className="text-xs text-[#78716C] mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setInputType("text");
                }}
                className="w-8 h-8 rounded-lg bg-white flex items-center justify-center"
              >
                <X className="w-4 h-4 text-[#78716C]" />
              </button>
            </div>
          ) : (
            <motion.div
              onClick={() => fileRef.current?.click()}
              whileTap={{ scale: 0.98 }}
              className="border-2 border-dashed border-[#E7E5E4] rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer"
            >
              <div className="w-12 h-12 bg-[#F5F5F4] rounded-xl flex items-center justify-center">
                <Upload className="w-6 h-6 text-[#78716C]" />
              </div>
              <p className="text-sm font-semibold text-[#1C1B19]">
                Tap to upload
              </p>
              <p className="text-xs text-[#78716C] text-center">
                PDF, DOCX, PPTX, TXT, JPG, PNG up to 10MB
              </p>
            </motion.div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept={acceptedTypes}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Tone Selector */}
        <div>
          <label className="text-sm font-semibold text-[#1C1B19] mb-2 block">
            Explanation Tone
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {tones.map((t) => (
              <button
                key={t.value}
                onClick={() => setTone(t.value)}
                className={`flex-shrink-0 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  tone === t.value
                    ? "gradient-primary text-white"
                    : "bg-[#F5F5F4] text-[#78716C]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="text-sm font-semibold text-[#1C1B19] mb-2 block">
            Tags <span className="text-[#78716C] font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Type a tag and press Enter"
            className="w-full px-4 py-4 rounded-2xl bg-[#F5F5F4] text-[#1C1B19] placeholder:text-[#78716C] text-base outline-none focus:ring-2 focus:ring-[#F95E08] transition"
          />
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#ECEDC7] text-sm font-medium text-[#1C1B19]"
                >
                  #{tag}
                  <button onClick={() => removeTag(i)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full gradient-primary py-4 rounded-2xl text-white font-bold text-base active:scale-95 transition-transform disabled:opacity-60"
        >
          {isLoading ? "Creating Note..." : "Create Note"}
        </button>
      </div>
    </div>
  );
};

export default NoteInput;

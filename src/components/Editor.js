import React, { useState, useRef, useEffect } from "react";
import { BiUndo, BiRedo, BiSave, BiChevronDown } from "react-icons/bi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { saveAs } from "file-saver";

function Editor() {
  const quillRef = useRef(null);
  const [editorHtml, setEditorHtml] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditorDirty, setIsEditorDirty] = useState(false);
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link"],
      [{ background: [] }],
      [{ color: [] }],
      ["image"],
      ["video"],
      ["direction"],
    ],
  };

  const formats = [
    "header",
    "size",
    "font",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "align",
    "indent",
    "link",
    "background",
    "color",
    "image",
    "video",
    "direction",
  ];
  const reactQuillStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    background: "#fff",
  };
  const characterCount = editorHtml.replace(/<[^>]*>/g, "").length;

  const handleChange = (html) => {
    setEditorHtml(html);
    setIsEditorDirty(true);
  };
  const handleUndo = () => {
    const quill = quillRef.current.getEditor();
    quill.history.undo();
  };

  const handleRedo = () => {
    const quill = quillRef.current.getEditor();
    quill.history.redo();
  };

  const handleSaveAsTXT = () => {
    setIsEditorDirty(true);
    setIsLoading(true); // Set loading state to true

    const quill = quillRef.current.getEditor();
    const text = quill.getText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });

    saveAs(blob, "document.txt");

    setIsLoading(false); // Set loading state back to false
  };

  const handleSaveAsHTML = () => {
    const htmlContent = editorHtml;
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    saveAs(blob, "document.html");
    setIsEditorDirty(true);
  };

  useEffect(() => {
    // Add event listener for beforeunload
    const handleBeforeUnload = (e) => {
      if (isEditorDirty) {
        e.preventDefault();
        e.returnValue = ""; // Display a confirmation message
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // Remove event listener when component unmounts
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isEditorDirty]);
  return (
    <div className="editor">
      <ReactQuill
        ref={quillRef}
        value={editorHtml}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder="Text here..."
        style={reactQuillStyle}
      />
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
        className="characters"
      >
        <span>{characterCount > 1 ? "Characters" : "Character"}:</span>{" "}
        <div>
          {characterCount} <BiSave />
        </div>
      </div>
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleUndo}>
          <BiUndo />
        </button>
        <button onClick={handleRedo}>
          <BiRedo />
        </button>
      </div>
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleSaveAsTXT} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save as TXT"}
        </button>
        <div style={{ marginTop: "10px" }}>
          <button onClick={handleSaveAsHTML}>Save as HTML</button>
        </div>
      </div>
    </div>
  );
}

export default Editor;

import React, { useState, useRef, useEffect } from "react";
import {
  BiUndo,
  BiRedo,
  BiSave,
  BiChevronDown,
  BiCopyAlt,
} from "react-icons/bi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { saveAs } from "file-saver";

function Editor() {
  const quillRef = useRef(null);
  const [editorHtml, setEditorHtml] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [saveBtnOption, setSaveBtnOption] = useState(false);
  const [isEditorDirty, setIsEditorDirty] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(false);
  const [copyStatus, setCopyStatus] = useState(null);

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
    minHeight: "50vh",
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
    setIsLoading(true);
    const quill = quillRef.current.getEditor();
    const text = quill.getText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "document.txt");
    setIsLoading(false);
  };

  const handleSaveAsHTML = () => {
    const htmlContent = editorHtml;
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    saveAs(blob, "document.html");
    setIsEditorDirty(true);
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isEditorDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isEditorDirty]);

  const saveBtnOptionHandler = () => {
    setSaveBtnOption(!saveBtnOption);
  };

  const handleSearchInputChange = (e) => {
    const searchText = e.target.value.trim();
    setSearchQuery(searchText);

    const quill = quillRef.current.getEditor();
    const quillText = quill.getText();

    quill.formatText(0, quillText.length, "background", false);

    if (searchText) {
      const index = quillText.indexOf(searchText);
      if (index !== -1) {
        quill.formatText(index, searchText.length, "background", "yellow");
        setSearchResult(true);
      } else {
        setSearchResult(false);
      }
    } else {
      setSearchResult(false);
    }
  };

  const handleCopyToClipboard = () => {
    const quill = quillRef.current.getEditor();
    const text = quill.getText();
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    setCopyStatus("Copied");

    setTimeout(() => {
      setCopyStatus(null);
    }, 2000);
  };

  return (
    <div className="editor">
      <div className="mainAbsolute">
        <div className="firstFlex">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
            className="characters"
          >
            <span>{characterCount > 1 ? "Characters" : "Character"}:</span>{" "}
            <div>{characterCount}</div>
          </div>

          <div className="undoAndRedoBtn">
            <button onClick={handleUndo}>
              <BiUndo size={18} />
            </button>
            <button onClick={handleRedo}>
              <BiRedo size={18} />
            </button>
          </div>
        </div>
        <div className="searchContainer">
          <input
            type="text"
            placeholder="Search text..."
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          {searchResult ? (
            <div className="searchResult">Result found.</div>
          ) : (
            <div className="noSearchResult">No result found.</div>
          )}
        </div>
      </div>
      <ReactQuill
        ref={quillRef}
        value={editorHtml}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder="Enter your text here..."
        style={reactQuillStyle}
        theme="snow"
      />

      <div className="bottomFlex">
        <button className="copyToClipboard" onClick={handleCopyToClipboard}>
          {copyStatus === "Copied" ? "Copied" : "Copy to Clipboard"}
          <BiCopyAlt />
        </button>
        <div className="savingContainer">
          <div className="saveBtn" onClick={saveBtnOptionHandler}>
            <BiSave style={{ background: "transparent" }} />
            <span>Save as</span>
            <BiChevronDown style={{ background: "transparent" }} />
          </div>
          {saveBtnOption && (
            <div className="saveBtnOption">
              <button onClick={handleSaveAsHTML}>
                .html <span>Recommended </span>
              </button>
              <button onClick={handleSaveAsTXT} disabled={isLoading}>
                {isLoading ? "Saving..." : ".txt"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Editor;

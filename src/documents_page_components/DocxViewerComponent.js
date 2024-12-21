import React, { useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import Spinner from "../Spinner";

const DocxViewerComponent = ({ fileUrl }) => {
  const containerRef = useRef(null);
  const [isDocLoading, setIsDocLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        setIsDocLoading(true);
        setHasError(false);

        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch document");
        }

        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        if (containerRef.current) {
          await renderAsync(new Uint8Array(arrayBuffer), containerRef.current, null);
        }
      } catch (error) {
        console.error("Error loading document:", error);
        setHasError(true);
      } finally {
        setIsDocLoading(false);
      }
    };

    if (fileUrl) {
      fetchFile();
    }
  }, [fileUrl]);

  return (
    <div
      style={{
        position: "relative",
        border: "1px solid #ccc",
        padding: "10px",
        maxHeight: "1200px",
        overflowY: "auto",
      }}
    >
      {isDocLoading && (
          <Spinner />
      )}
      {hasError ? (
        <div style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
          Failed to load the document. Please try again later.
        </div>
      ) : (
        <div ref={containerRef}>
          {/* Rendered document will appear here */}
        </div>
      )}
    </div>
  );
};

export default DocxViewerComponent;

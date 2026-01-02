// TextType.jsx
'use client';
import { useEffect, useState } from "react";

export default function TextType({ lines, className, showCursor = true, cursorCharacter = "|" }) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    if (!lines || lines.length === 0) return;

    let cancelled = false;

    const typeLine = async (lineIndex) => {
      if (cancelled || lineIndex >= lines.length) return;

      const { text, typing: typingSpeed, deleting: deletingSpeed, pause } = lines[lineIndex];

      // Typing
      for (let i = 0; i <= text.length; i++) {
        if (cancelled) return;
        setDisplayText(text.slice(0, i));
        await new Promise(r => setTimeout(r, typingSpeed));
      }

      // Pause
      await new Promise(r => setTimeout(r, pause));

      // Deleting
      for (let i = text.length; i >= 0; i--) {
        if (cancelled) return;
        setDisplayText(text.slice(0, i));
        await new Promise(r => setTimeout(r, deletingSpeed));
      }

      // Next line
      if (!cancelled) typeLine(lineIndex + 1);
    };

    typeLine(0);

    return () => { cancelled = true; };
  }, [lines]);

  return (
    <span className={className}>
      {displayText}{showCursor && <span>{cursorCharacter}</span>}
    </span>
  );
}

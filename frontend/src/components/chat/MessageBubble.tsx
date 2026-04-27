"use client";

import { ReactNode } from "react";
import { Message } from "./types";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./CodeBlock";

function renderInlineMarkdown(text: string): ReactNode[] {
  return text.split("\n").map((line, i, arr) => {
    const parts = line
      .split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
      .map((part, j) => {
        if (/^\*\*[^*]+\*\*$/.test(part))
          return <strong key={j}>{part.slice(2, -2)}</strong>;
        if (/^\*[^*]+\*$/.test(part))
          return <em key={j}>{part.slice(1, -1)}</em>;
        if (/^`[^`]+`$/.test(part))
          return (
            <code
              key={j}
              className="bg-black/10 dark:bg-white/10 rounded px-1 font-mono text-xs"
            >
              {part.slice(1, -1)}
            </code>
          );
        return part;
      });
    return (
      <span key={i}>
        {parts}
        {i < arr.length - 1 && <br />}
      </span>
    );
  });
}

// Splits on ``` so incomplete (streaming) code blocks render immediately.
// Even indices = prose, odd indices = code block content (may be incomplete).
function renderMarkdown(content: string, isStreaming = false): ReactNode[] {
  const segments = content.split("```");
  const elements: ReactNode[] = [];

  segments.forEach((segment, i) => {
    const isCodeSegment = i % 2 === 1;

    if (!isCodeSegment) {
      // Regular prose
      if (segment) {
        elements.push(
          <span
            key={`text-${i}`}
            className="whitespace-pre-wrap break-words"
          >
            {renderInlineMarkdown(segment)}
          </span>,
        );
      }
    } else {
      // Code block — extract language from first line
      const newlineIdx = segment.indexOf("\n");
      let language = "text";
      let code = segment;

      if (newlineIdx !== -1) {
        const firstLine = segment.slice(0, newlineIdx).trim();
        language = firstLine || "text";
        code = segment.slice(newlineIdx + 1);
      }

      // Strip trailing newline
      code = code.replace(/\n$/, "");

      // Is this the last segment while still streaming? → incomplete block
      const isIncomplete = isStreaming && i === segments.length - 1;

      elements.push(
        <CodeBlock
          key={`code-${i}`}
          code={code}
          language={language}
          isStreaming={isIncomplete}
        />,
      );
    }
  });

  return elements;
}

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn("flex px-4 py-3", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "text-sm leading-relaxed",
          isUser
            ? "max-w-[75%] rounded-3xl bg-muted dark:bg-white/10 text-foreground px-4 py-2.5"
            : "max-w-[75%]",
        )}
      >
        <div className="wrap-break-word">
          {renderMarkdown(message.content, isStreaming)}
        </div>
        {isStreaming && (
          <span className="ml-1 inline-block h-4 w-0.5 animate-pulse bg-current align-middle" />
        )}
      </div>
    </div>
  );
}


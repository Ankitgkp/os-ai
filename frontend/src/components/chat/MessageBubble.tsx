"use client";

import { ReactNode } from "react";
import { Message } from "./types";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./CodeBlock";

// Renders inline formatting: **bold**, *italic*, `code`
function renderInlineSpans(text: string): ReactNode[] {
  return text
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
}

// Renders a single prose line with correct block element
function renderProseLine(line: string, key: number): ReactNode {
  // Headings
  const h1 = line.match(/^# (.+)/);
  const h2 = line.match(/^## (.+)/);
  const h3 = line.match(/^### (.+)/);
  if (h1) return <h1 key={key} className="text-xl font-bold mt-5 mb-2 text-foreground">{renderInlineSpans(h1[1])}</h1>;
  if (h2) return <h2 key={key} className="text-base font-bold mt-4 mb-1.5 text-foreground">{renderInlineSpans(h2[1])}</h2>;
  if (h3) return <h3 key={key} className="text-sm font-bold mt-4 mb-1 text-foreground">{renderInlineSpans(h3[1])}</h3>;

  // Bullet list items (supports indentation)
  const bullet = line.match(/^(\s*)[-*]\s+(.+)/);
  if (bullet) {
    const indent = Math.floor(bullet[1].length / 2);
    return (
      <div key={key} className="flex gap-2 my-0.5" style={{ paddingLeft: `${indent * 16}px` }}>
        <span className="text-foreground/50 select-none mt-px">•</span>
        <span className="break-words">{renderInlineSpans(bullet[2])}</span>
      </div>
    );
  }

  // Numbered list items
  const numbered = line.match(/^(\s*)(\d+)\.\s+(.+)/);
  if (numbered) {
    const indent = Math.floor(numbered[1].length / 2);
    return (
      <div key={key} className="flex gap-2 my-0.5" style={{ paddingLeft: `${indent * 16}px` }}>
        <span className="text-foreground/50 select-none min-w-[1.25rem] text-right font-mono text-xs mt-px">{numbered[2]}.</span>
        <span className="break-words">{renderInlineSpans(numbered[3])}</span>
      </div>
    );
  }

  // Blank line
  if (line.trim() === "") return <div key={key} className="h-2" />;

  // Regular paragraph text
  return <p key={key} className="my-0.5 break-words">{renderInlineSpans(line)}</p>;
}

// Renders a prose segment (splits into lines and classifies each)
function renderProseSegment(text: string, segKey: number): ReactNode {
  const lines = text.split("\n");
  return (
    <div key={`prose-${segKey}`}>
      {lines.map((line, i) => renderProseLine(line, i))}
    </div>
  );
}

// Splits on ``` so incomplete (streaming) code blocks render immediately.
// Even indices = prose, odd indices = code block content (may be incomplete).
function renderMarkdown(content: string, isStreaming = false): ReactNode[] {
  const segments = content.split("```");
  const elements: ReactNode[] = [];

  segments.forEach((segment, i) => {
    const isCodeSegment = i % 2 === 1;

    if (!isCodeSegment) {
      if (segment) elements.push(renderProseSegment(segment, i));
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

      code = code.replace(/\n$/, "");

      // Last odd segment while streaming = incomplete block
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


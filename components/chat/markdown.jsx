"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

// Styled renderers so AI replies (tables, lists, headings) are easy to read.
const components = {
  table: ({ node, ...props }) => (
    <div className="not-prose my-4 w-full overflow-x-auto rounded-lg border border-slate-700">
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => <thead className="bg-slate-900/80" {...props} />,
  th: ({ node, ...props }) => (
    <th
      className="border-b border-slate-700 px-3 py-2 font-semibold text-purple-300 whitespace-nowrap"
      {...props}
    />
  ),
  tr: ({ node, ...props }) => (
    <tr className="border-b border-slate-700/60 last:border-0 even:bg-slate-900/30" {...props} />
  ),
  td: ({ node, ...props }) => (
    <td className="px-3 py-2 align-top leading-relaxed text-slate-200" {...props} />
  ),
  a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />,
};

export default function Markdown({ children }) {
  return (
    <div className="prose prose-sm prose-invert max-w-none leading-relaxed prose-headings:text-purple-300 prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-li:my-0.5 prose-ul:my-2 prose-ol:my-2 prose-strong:text-white prose-a:text-purple-400 prose-code:text-purple-300 prose-code:before:content-none prose-code:after:content-none prose-hr:border-slate-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

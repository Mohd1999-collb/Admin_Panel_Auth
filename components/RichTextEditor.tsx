"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

// IMPORTANT: disable SSR
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (content: string) => void;
}) {
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write your blog here...",
      height: 400,
    }),
    []
  );

  return (
    <JoditEditor
      value={value}
      config={config}
      onBlur={(newContent: string) => onChange(newContent)}
    />
  );
}

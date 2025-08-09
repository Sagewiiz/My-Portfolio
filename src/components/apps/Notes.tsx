import React from "react";

export default function Notes() {
  const [text, setText] = useState<string>(
    localStorage.getItem("notes-content") || "# Notes\n\nWrite anything here."
  );

  useEffect(() => {
    localStorage.setItem("notes-content", text);
  }, [text]);

  return (
    <div className="h-full w-full bg-white dark:bg-gray-900">
      <textarea
        className="size-full p-3 outline-none bg-transparent text-c-700"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}



import React from "react";

export default function Notes() {
  const [text, setText] = useState<string>("Loading…");
  const token = sessionStorage.getItem("auth_token");
  const profileId = sessionStorage.getItem("profile_id");

  useEffect(() => {
    const load = async () => {
      if (!token || !profileId) return;
      const resp = await fetch(`/api/content?app=notes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await resp.json();
      setText(data.content || "# Notes\n\nWrite anything here.");
    };
    load();
  }, [token, profileId]);

  useEffect(() => {
    if (!token || !profileId) return;
    const id = setTimeout(async () => {
      await fetch(`/api/content?app=notes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: text })
      });
    }, 500);
    return () => clearTimeout(id);
  }, [text, token, profileId]);

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



import React from "react";
import PasswordGate from "~/components/PasswordGate";

export default function Notes() {
  const [text, setText] = useState<string>("Loading…");

  return (
    <PasswordGate>
      {({ token, profileId, logout }) => {
        useEffect(() => {
          const load = async () => {
            const resp = await fetch(`/api/content?app=notes`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const data = await resp.json();
            setText(data.content || "# Notes\n\nWrite anything here.");
          };
          load();
        }, [token, profileId]);

        useEffect(() => {
          const id = setTimeout(async () => {
            await fetch(`/api/content?app=notes`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({ content: text })
            });
          }, 500);
          return () => clearTimeout(id);
        }, [text, token, profileId]);

        return (
          <div className="h-full w-full bg-white dark:bg-gray-900">
            <div className="p-2 text-right text-xs">
              <button className="safari-btn w-20" onClick={logout}>
                Lock
              </button>
            </div>
            <textarea
              className="size-full p-3 outline-none bg-transparent text-c-700"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        );
      }}
    </PasswordGate>
  );
}

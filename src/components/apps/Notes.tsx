import React from "react";
import PasswordGate from "~/components/PasswordGate";

type SaveStatus = "idle" | "syncing" | "saved" | "error";

function NotesInner({
  token,
  profileId,
  logout
}: {
  token: string;
  profileId: string;
  logout: () => void;
}) {
  const [text, setText] = useState<string>("Loading…");
  const [status, setStatus] = useState<SaveStatus>("idle");

  useEffect(() => {
    const load = async () => {
      try {
        setStatus("syncing");
        const resp = await fetch(`/api/content?app=notes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await resp.json();
        setText(data.content || "# Notes\n\nWrite anything here.");
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    };
    load();
  }, [token, profileId]);

  useEffect(() => {
    if (status === "idle") return;
    const id = setTimeout(async () => {
      try {
        setStatus("syncing");
        const resp = await fetch(`/api/content?app=notes`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ content: text })
        });
        if (!resp.ok) throw new Error("save failed");
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    }, 500);
    return () => clearTimeout(id);
  }, [text, token, profileId]);

  return (
    <div className="h-full w-full bg-white dark:bg-gray-900">
      <div className="p-2 flex items-center justify-between text-xs">
        <div>
          {status === "syncing" && <span className="text-amber-600">Syncing…</span>}
          {status === "saved" && <span className="text-emerald-600">Saved</span>}
          {status === "error" && <span className="text-red-600">Error</span>}
        </div>
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
}

export default function Notes() {
  return (
    <PasswordGate>
      {({ token, profileId, logout }) => (
        <NotesInner token={token} profileId={profileId} logout={logout} />
      )}
    </PasswordGate>
  );
}

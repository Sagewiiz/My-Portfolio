import { Editor, rootCtx, defaultValueCtx } from "@milkdown/core";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { commonmark } from "@milkdown/preset-commonmark";
import { gfm } from "@milkdown/preset-gfm";
import { history } from "@milkdown/plugin-history";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
// Typora is now read-only demo. Use Notes app for editable/persistent pad.

type SaveStatus = "idle" | "syncing" | "saved" | "error";

const MilkdownEditor = ({
  token,
  profileId,
  onStatusChange
}: {
  token: string;
  profileId: string;
  onStatusChange: (s: SaveStatus) => void;
}) => {
  const { typoraMd, setTyporaMd } = useStore((state) => ({
    typoraMd: state.typoraMd,
    setTyporaMd: state.setTyporaMd
  }));
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [initialMd, setInitialMd] = useState<string | null>(null);
  const [canSave, setCanSave] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        setStatus("syncing");
        onStatusChange("syncing");
        let content = "";
        if (token === "dev-token") {
          const ls = localStorage.getItem(`typora:${profileId}`);
          content = ls ?? "";
        } else {
          const resp = await fetch(`/api/content?app=typora`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!resp.ok) throw new Error("load failed");
          const data = await resp.json();
          content = data.content ?? "";
        }
        setTyporaMd(content);
        setInitialMd(content);
        setStatus("saved");
        onStatusChange("saved");
        // enable saves only after initial content is applied
        setCanSave(true);
      } catch {
        setStatus("error");
        onStatusChange("error");
        setInitialMd("");
      }
    };
    load();
  }, [token, profileId, setTyporaMd, onStatusChange]);

  useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, initialMd ?? typoraMd);
        ctx
          .get(listenerCtx)
          .mounted((ctx) => {
            const wrapper = ctx.get(rootCtx) as HTMLDivElement;
            const editor = wrapper.querySelector(
              ".editor[role='textbox']"
            ) as HTMLDivElement;
            wrapper.onclick = () => editor?.focus();
          })
          .markdownUpdated(async (_, markdown) => {
            if (!canSave) return; // avoid overwriting server with default before load
            setTyporaMd(markdown);
            if (token) {
              try {
                setStatus("syncing");
                onStatusChange("syncing");
                if (token === "dev-token") {
                  localStorage.setItem(`typora:${profileId}`, markdown);
                  setStatus("saved");
                  onStatusChange("saved");
                  return;
                }
                const resp = await fetch(`/api/content?app=typora`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                  },
                  body: JSON.stringify({ content: markdown })
                });
                if (!resp.ok) throw new Error("save failed");
                setStatus("saved");
                onStatusChange("saved");
              } catch {
                setStatus("error");
                onStatusChange("error");
              }
            }
          });

        root.className =
          "typora bg-white dark:bg-gray-800 text-c-700 h-full overflow-y-scroll";
      })
      .use(listener)
      .use(commonmark)
      .use(gfm)
      .use(history)
  );

  if (initialMd === null) {
    return (
      <div className="h-full w-full flex items-center justify-center text-xs">
        Loading…
      </div>
    );
  }
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 min-h-0">
        <Milkdown />
      </div>
    </div>
  );
};

export default function Typora() {
  // Public demo: no lock; no persistence. Show hint to use Notes.
  const [status, setStatus] = useState<SaveStatus>("idle");
  return (
    <MilkdownProvider>
      <div className="p-1 px-2 flex items-center justify-between text-xs bg-c-200">
        <div>
          {status === "syncing" && <span className="text-amber-600">Syncing…</span>}
          {status === "saved" && <span className="text-emerald-600">Saved</span>}
          {status === "error" && <span className="text-red-600">Error</span>}
        </div>
      </div>
      <div className="px-2 py-1 text-xs text-c-600">
        For using "DontPad" like features use Notes, or to leave a message for me use
        password "meow" in Notes.
      </div>
      <MilkdownEditor
        token={"dev-token"}
        profileId={"public"}
        onStatusChange={setStatus}
      />
    </MilkdownProvider>
  );
}

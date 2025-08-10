import { Editor, rootCtx, defaultValueCtx } from "@milkdown/core";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { commonmark } from "@milkdown/preset-commonmark";
import { gfm } from "@milkdown/preset-gfm";
import { history } from "@milkdown/plugin-history";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import PasswordGate from "~/components/PasswordGate";

const MilkdownEditor = () => {
  const { typoraMd, setTyporaMd } = useStore((state) => ({
    typoraMd: state.typoraMd,
    setTyporaMd: state.setTyporaMd
  }));
  const token = sessionStorage.getItem("auth_token");

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      const resp = await fetch(`/api/content?app=typora`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await resp.json();
      if (data.content) setTyporaMd(data.content);
    };
    load();
  }, [token, setTyporaMd]);

  useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, typoraMd);
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
            setTyporaMd(markdown);
            if (token) {
              await fetch(`/api/content?app=typora`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ content: markdown })
              });
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

  return <Milkdown />;
};

export default function Typora() {
  return (
    <PasswordGate>
      {({ token, profileId, logout }) => (
        <MilkdownProvider>
          <div className="p-1 text-right text-xs">
            <button className="safari-btn w-20" onClick={logout}>
              Lock
            </button>
          </div>
          <MilkdownEditor />
        </MilkdownProvider>
      )}
    </PasswordGate>
  );
}

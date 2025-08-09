import React from "react";

type Game = {
  id: string;
  title: string;
  type: "embed" | "iframe";
  src: string;
};

const GAMES: Game[] = [
  {
    id: "slowroads",
    title: "Slow Roads",
    type: "iframe",
    src: "https://slowroads.io/"
  },
  {
    id: "slope",
    title: "Krunker.io",
    type: "iframe",
    src: "https://krunker.io/"
  },
  {
    id: "tetris",
    title: "Tetris",
    type: "iframe",
    src: "https://tetris.com/play-tetris"
  }
];

export default function Games() {
  const [current, setCurrent] = useState<Game>(GAMES[0]);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [showTip, setShowTip] = useState<boolean>(false);

  const Sidebar = (
    <aside
      className={`border-r border-c-300 p-2 overflow-y-auto h-full ${
        collapsed ? "hidden" : "block col-span-3"
      }`}
    >
      <div className="text-sm font-medium mb-2 text-c-600">Games</div>
      <ul>
        {GAMES.map((g) => (
          <li key={g.id}>
            <button
              className={`w-full text-left rounded px-2 py-1 mb-1 hover:bg-c-200 ${
                current.id === g.id ? "bg-c-200" : ""
              }`}
              onClick={() => setCurrent(g)}
            >
              {g.title}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex justify-center">
        <button
          className="safari-btn w-9 text-c-700"
          title="Hide sidebar"
          onClick={() => setCollapsed(true)}
        >
          <span className="i-ri:arrow-left-s-line" />
        </button>
      </div>
    </aside>
  );

  return (
    <div className="h-full w-full grid grid-cols-12 bg-white dark:bg-gray-900 relative">
      {Sidebar}

      {/* Re-open tab when collapsed */}
      {collapsed && (
        <button
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 rounded-full size-8 flex-center bg-c-200 hover:bg-c-300 shadow"
          title="Show sidebar"
          onClick={() => setCollapsed(false)}
          aria-label="Show sidebar"
        >
          <span className="i-ri:arrow-right-s-line" />
        </button>
      )}

      <main className={`${collapsed ? "col-span-12" : "col-span-9"} h-full relative`}>
        {current.type === "iframe" && (
          <iframe
            title={current.title}
            src={current.src}
            className="w-full h-full bg-black block border-0"
            allow="fullscreen; autoplay; clipboard-read; clipboard-write"
            allowFullScreen
          />
        )}

        {/* Quick tip overlay */}
        <button
          className="absolute right-2 top-2 z-10 rounded-full size-8 flex-center bg-c-200 hover:bg-c-300 shadow"
          title="How to exit"
          onClick={() => setShowTip(!showTip)}
          aria-label="Show tip"
        >
          <span className="i-ri:question-line" />
        </button>
        {showTip && (
          <div className="absolute right-2 top-12 z-10 bg-c-100 border border-c-300 rounded p-2 text-xs max-w-60 shadow">
            To close the game, Press F5.
          </div>
        )}
      </main>
    </div>
  );
}




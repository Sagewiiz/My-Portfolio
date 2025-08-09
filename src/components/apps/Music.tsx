import React from "react";
import playlist from "~/configs/playlist";

export default function Music() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState<number>(0);
  const [query, setQuery] = useState<string>("");
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.src = playlist[index].audio;
    el.play().catch(() => {});
    if ("mediaSession" in navigator) {
      // @ts-expect-error web api
      navigator.mediaSession.metadata = new MediaMetadata({
        title: playlist[index].title,
        artist: playlist[index].artist,
        artwork: [{ src: playlist[index].cover, sizes: "512x512", type: "image/png" }]
      });
    }
  }, [index]);

  const onSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const val = query.trim();
      const match = playlist.findIndex((t) =>
        `${t.title} ${t.artist}`.toLowerCase().includes(val.toLowerCase())
      );
      if (match >= 0) setIndex(match);
      else window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(val)}`);
    }
  };

  const current = playlist[index];

  return (
    <div className="h-full w-full grid grid-cols-12 bg-white dark:bg-gray-900">
      <aside className="col-span-3 border-r border-c-300 p-2">
        <div className="mb-2 text-sm text-c-600">Library</div>
        <div className="space-y-2">
          {playlist.map((t, i) => (
            <div
              key={`${t.title}-${i}`}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                index === i ? "bg-c-200" : hovered === i ? "bg-c-100" : ""
              }`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setIndex(i)}
            >
              <img src={t.cover} className="w-10 h-10 rounded" alt={t.title} />
              <div className="flex-1">
                <div className="text-sm font-medium text-c-black">{t.title}</div>
                <div className="text-xs text-c-500">{t.artist}</div>
              </div>
              {hovered === i && <span className="i-ri:play-fill text-lg text-c-700" />}
            </div>
          ))}
        </div>
      </aside>
      <main className="col-span-9 h-full flex flex-col">
        <div className="p-3 flex items-center gap-2 border-b border-c-300">
          <input
            className="flex-1 h-8 px-2 rounded bg-c-200 no-outline"
            placeholder="Search song or artist (others open on YouTube)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onSearch}
          />
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4 p-4">
          <div className="rounded-lg overflow-hidden bg-c-200 flex items-center justify-center">
            <img src={current.cover} alt={current.title} className="w-56 h-56 rounded shadow" />
          </div>
          <div className="flex flex-col">
            <div className="text-2xl font-semibold text-c-black">{current.title}</div>
            <div className="text-c-600">{current.artist}</div>
            <div className="mt-4 flex items-center gap-2">
              <button className="safari-btn w-9" onClick={() => audioRef.current?.pause()}>
                <span className="i-ri:pause-line" />
              </button>
              <button className="safari-btn w-9" onClick={() => audioRef.current?.play()}>
                <span className="i-ri:play-line" />
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                defaultValue={1}
                onChange={(e) => {
                  if (audioRef.current) audioRef.current.volume = Number(e.target.value);
                }}
              />
            </div>
            <div className="mt-2 text-xs text-c-500">
              Tip: Hover a track in the list to reveal a play icon. Search unknown titles to open YouTube.
            </div>
          </div>
        </div>
        <audio ref={audioRef} />
      </main>
    </div>
  );
}



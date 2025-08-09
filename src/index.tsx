import React from "react";
import { createRoot } from "react-dom/client";

import Desktop from "~/pages/Desktop";
import Login from "~/pages/Login";
import Boot from "~/pages/Boot";

import "@unocss/reset/tailwind.css";
import "uno.css";
import "katex/dist/katex.min.css";
import "~/styles/index.css";

export default function App() {
  const [login, setLogin] = useState<boolean>(false);
  const [booting, setBooting] = useState<boolean>(false);
  const [restart, setRestart] = useState<boolean>(false);
  const [sleep, setSleep] = useState<boolean>(false);
  const { winWidth } = useWindowSize();
  const [mobileNoticeDismissed, setMobileNoticeDismissed] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage.getItem("mobile_notice_dismissed") === "1") {
      setMobileNoticeDismissed(true);
    }
  }, []);

  const dismissMobileNotice = () => {
    setMobileNoticeDismissed(true);
    localStorage.setItem("mobile_notice_dismissed", "1");
  };

  const shutMac = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setRestart(false);
    setSleep(false);
    setLogin(false);
    setBooting(true);
  };

  const restartMac = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setRestart(true);
    setSleep(false);
    setLogin(false);
    setBooting(true);
  };

  const sleepMac = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setRestart(false);
    setSleep(true);
    setLogin(false);
    setBooting(true);
  };

  const content = booting ? (
    <Boot restart={restart} sleep={sleep} setBooting={setBooting} />
  ) : login ? (
    <Desktop
      setLogin={setLogin}
      shutMac={shutMac}
      sleepMac={sleepMac}
      restartMac={restartMac}
    />
  ) : (
    <Login
      setLogin={setLogin}
      shutMac={shutMac}
      sleepMac={sleepMac}
      restartMac={restartMac}
    />
  );

  return (
    <div className="size-full">
      {content}
      {winWidth < 640 && !mobileNoticeDismissed && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur grid place-items-center">
          <div className="relative text-center text-white px-6 py-4 bg-black/40 rounded-lg border border-white/20">
            <button
              className="absolute -right-2 -top-2 rounded-full size-7 flex-center bg-white/20 hover:bg-white/30"
              aria-label="Close"
              onClick={dismissMobileNotice}
            >
              <span className="i-ri:close-line" />
            </button>
            <div className="text-xl font-semibold">Use/Open in Laptop for experince</div>
            <div className="text-sm opacity-80 mt-1">This site is optimized for larger screens.</div>
          </div>
        </div>
      )}
    </div>
  );
}

const rootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

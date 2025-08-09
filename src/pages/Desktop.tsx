import React from "react";
import { apps, wallpapers } from "~/configs";
import { minMarginY } from "~/utils";
import type { MacActions } from "~/types";

interface DesktopState {
  showApps: {
    [key: string]: boolean;
  };
  appsZ: {
    [key: string]: number;
  };
  maxApps: {
    [key: string]: boolean;
  };
  minApps: {
    [key: string]: boolean;
  };
  maxZ: number;
  showLaunchpad: boolean;
  currentTitle: string;
  hideDockAndTopbar: boolean;
  spotlight: boolean;
}

export default function Desktop(props: MacActions) {
  const [state, setState] = useState({
    showApps: {},
    appsZ: {},
    maxApps: {},
    minApps: {},
    maxZ: 2,
    showLaunchpad: false,
    currentTitle: "Finder",
    hideDockAndTopbar: false,
    spotlight: false
  } as DesktopState);

  const [spotlightBtnRef, setSpotlightBtnRef] =
    useState<React.RefObject<HTMLDivElement> | null>(null);

  const { dark, brightness } = useStore((state) => ({
    dark: state.dark,
    brightness: state.brightness
  }));

  const getAppsData = (): void => {
    const initShow: Record<string, boolean> = {};
    const initZ: Record<string, number> = {};
    const initMax: Record<string, boolean> = {};
    const initMin: Record<string, boolean> = {};

    apps.forEach((app) => {
      initShow[app.id] = !!app.show;
      initZ[app.id] = 2;
      initMax[app.id] = false;
      initMin[app.id] = false;
    });

    setState((prev) => ({ ...prev, showApps: initShow, appsZ: initZ, maxApps: initMax, minApps: initMin }));
  };

  useEffect(() => {
    getAppsData();
  }, []);

  const toggleLaunchpad = (target: boolean): void => {
    const r = document.querySelector(`#launchpad`) as HTMLElement;
    if (target) {
      r.style.transform = "scale(1)";
      r.style.transition = "ease-in 0.2s";
    } else {
      r.style.transform = "scale(1.1)";
      r.style.transition = "ease-out 0.2s";
    }

    setState((prev) => ({ ...prev, showLaunchpad: target }));
  };

  const toggleSpotlight = (): void => {
    setState((prev) => ({ ...prev, spotlight: !prev.spotlight }));
  };

  const setWindowPosition = (id: string): void => {
    const r = document.querySelector(`#window-${id}`) as HTMLElement;
    const rect = r.getBoundingClientRect();
    r.style.setProperty(
      "--window-transform-x",
      // "+ window.innerWidth" because of the boundary for windows
      (window.innerWidth + rect.x).toFixed(1).toString() + "px"
    );
    r.style.setProperty(
      "--window-transform-y",
      // "- minMarginY" because of the boundary for windows
      (rect.y - minMarginY).toFixed(1).toString() + "px"
    );
  };

  const setAppMax = (id: string, target?: boolean): void => {
    setState((prev) => {
      const nextMax = { ...prev.maxApps };
      const final = target === undefined ? !nextMax[id] : target;
      nextMax[id] = final;
      return { ...prev, maxApps: nextMax, hideDockAndTopbar: final };
    });
  };

  const setAppMin = (id: string, target?: boolean): void => {
    setState((prev) => {
      const nextMin = { ...prev.minApps };
      const final = target === undefined ? !nextMin[id] : target;
      nextMin[id] = final;
      return { ...prev, minApps: nextMin };
    });
  };

  const minimizeApp = (id: string): void => {
    setWindowPosition(id);

    // get the corrosponding dock icon's position
    let r = document.querySelector(`#dock-${id}`) as HTMLElement;
    const dockAppRect = r.getBoundingClientRect();

    r = document.querySelector(`#window-${id}`) as HTMLElement;
    // const appRect = r.getBoundingClientRect();
    const posY = window.innerHeight - r.offsetHeight / 2 - minMarginY;
    // "+ window.innerWidth" because of the boundary for windows
    const posX = window.innerWidth + dockAppRect.x - r.offsetWidth / 2 + 25;

    // translate the window to that position
    r.style.transform = `translate(${posX}px, ${posY}px) scale(0.2)`;
    r.style.transition = "ease-out 0.3s";

    // add it to the minimized app list
    setAppMin(id, true);
  };

  const closeApp = (id: string): void => {
    setAppMax(id, false);
    setState((prev) => ({
      ...prev,
      showApps: { ...prev.showApps, [id]: false },
      hideDockAndTopbar: false
    }));
  };

  const openApp = (id: string): void => {
    // add it to the shown app list
    const showApps = { ...state.showApps };
    showApps[id] = true;

    // move to the top (use a maximum z-index)
    const appsZ = { ...state.appsZ };
    const maxZ = state.maxZ + 1;
    appsZ[id] = maxZ;

    // get the title of the currently opened app
    const currentApp = apps.find((app) => {
      return app.id === id;
    });
    if (currentApp === undefined) {
      throw new TypeError(`App ${id} is undefined.`);
    }

    setState((prev) => ({
      ...prev,
      showApps,
      appsZ,
      maxZ,
      currentTitle: currentApp.title,
      showLaunchpad: false
    }));

    // track recent apps
    useStore.getState().addRecentApp(id);

    const minApps = state.minApps;
    // if the app has already been shown but minimized
    if (minApps[id]) {
      // move to window's last position
      const r = document.querySelector(`#window-${id}`) as HTMLElement;
      r.style.transform = `translate(${r.style.getPropertyValue(
        "--window-transform-x"
      )}, ${r.style.getPropertyValue("--window-transform-y")}) scale(1)`;
      r.style.transition = "ease-in 0.3s";
      // remove it from the minimized app list
      minApps[id] = false;
      setState({ ...state, minApps });
    }
  };

  const renderAppWindows = () => {
    return apps.map((app) => {
      if (app.desktop && state.showApps[app.id]) {
        const props = {
          id: app.id,
          title: app.title,
          width: app.width,
          height: app.height,
          minWidth: app.minWidth,
          minHeight: app.minHeight,
          aspectRatio: app.aspectRatio,
          x: app.x,
          y: app.y,
          z: state.appsZ[app.id],
          max: state.maxApps[app.id],
          min: state.minApps[app.id],
          close: closeApp,
          setMax: setAppMax,
          setMin: minimizeApp,
          focus: openApp
        };

        return (
          <AppWindow key={`desktop-app-${app.id}`} {...props}>
            {app.content}
          </AppWindow>
        );
      } else {
        return <div key={`desktop-app-${app.id}`} />;
      }
    });
  };

  return (
    <div
      className="size-full overflow-hidden bg-center bg-cover"
      style={{
        backgroundImage: `url(${dark ? wallpapers.night : wallpapers.day})`,
        filter: `brightness( ${(brightness as number) * 0.7 + 50}% )`
      }}
    >
      {/* Top Menu Bar */}
      <TopBar
        title={state.currentTitle}
        setLogin={props.setLogin}
        shutMac={props.shutMac}
        sleepMac={props.sleepMac}
        restartMac={props.restartMac}
        toggleSpotlight={toggleSpotlight}
        hide={state.hideDockAndTopbar}
        setSpotlightBtnRef={setSpotlightBtnRef}
      />

      {/* Desktop Apps */}
      <div className="window-bound z-10 absolute" style={{ top: minMarginY }}>
        {renderAppWindows()}
      </div>

      {/* Spotlight */}
      {state.spotlight && (
        <Spotlight
          openApp={openApp}
          toggleLaunchpad={toggleLaunchpad}
          toggleSpotlight={toggleSpotlight}
          btnRef={spotlightBtnRef as React.RefObject<HTMLDivElement>}
        />
      )}

      {/* Launchpad */}
      <Launchpad show={state.showLaunchpad} toggleLaunchpad={toggleLaunchpad} />

      {/* Dock */}
      <Dock
        open={openApp}
        showApps={state.showApps}
        showLaunchpad={state.showLaunchpad}
        toggleLaunchpad={toggleLaunchpad}
        hide={state.hideDockAndTopbar}
      />
    </div>
  );
}

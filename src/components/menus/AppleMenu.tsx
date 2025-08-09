import React from "react";

interface AppleMenuProps {
  logout: () => void;
  shut: (e: React.MouseEvent<HTMLLIElement>) => void;
  restart: (e: React.MouseEvent<HTMLLIElement>) => void;
  sleep: (e: React.MouseEvent<HTMLLIElement>) => void;
  toggleAppleMenu: () => void;
  btnRef: React.RefObject<HTMLDivElement>;
}

export default function AppleMenu({
  logout,
  shut,
  restart,
  sleep,
  toggleAppleMenu,
  btnRef
}: AppleMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { recentApps } = useStore((s) => ({ recentApps: s.recentApps }));

  useClickOutside(ref, toggleAppleMenu, [btnRef]);

  return (
    <div className="menu-box left-2 w-56" ref={ref}>
      <MenuItemGroup>
        <MenuItem onClick={() => alert("macOS Portfolio\nVersion 1.0 (web)\n© Sudhanshu Kumar")}>About This Mac</MenuItem>
      </MenuItemGroup>
      <MenuItemGroup>
        <MenuItem onClick={() => alert("Open Control Center to adjust system settings.")}>System Preferences...</MenuItem>
        <MenuItem onClick={() => window.open("https://apps.apple.com/", "_blank")}>App Store...</MenuItem>
      </MenuItemGroup>
      <MenuItemGroup>
        <MenuItem>
          <div>
            <div className="text-c-500 text-xs mb-1">Recent Items</div>
            <ul className="pl-1">
              {recentApps.length === 0 ? (
                <li className="text-c-500 text-xs">No Recent Items</li>
              ) : (
                recentApps.map((id) => (
                  <li key={`recent-${id}`} className="leading-6">{id}</li>
                ))
              )}
            </ul>
          </div>
        </MenuItem>
      </MenuItemGroup>
      <MenuItemGroup>
        <MenuItem onClick={() => alert("Press F5 to reload page or close app window using red button.")}>Force Quit...</MenuItem>
      </MenuItemGroup>
      <MenuItemGroup>
        <MenuItem onClick={sleep}>Sleep</MenuItem>
        <MenuItem onClick={restart}>Restart...</MenuItem>
        <MenuItem onClick={shut}>Shut Down...</MenuItem>
      </MenuItemGroup>
      <MenuItemGroup border={false}>
        <MenuItem onClick={logout}>Lock Screen</MenuItem>
        <MenuItem onClick={logout}>Log Out Sudhanshu Kumar...</MenuItem>
      </MenuItemGroup>
    </div>
  );
}

import React from "react";

interface GateProps {
  children: (ctx: { token: string; profileId: string }) => JSX.Element;
}

export default function PasswordGate({ children }: GateProps) {
  const [token, setToken] = useState<string | null>(sessionStorage.getItem("auth_token"));
  const [profileId, setProfileId] = useState<string | null>(sessionStorage.getItem("profile_id"));
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const unlock = async () => {
    setError(null);
    try {
      const resp = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Unlock failed");
      sessionStorage.setItem("auth_token", data.token);
      sessionStorage.setItem("profile_id", data.profileId);
      setToken(data.token);
      setProfileId(data.profileId);
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (!token || !profileId) {
    return (
      <div className="size-full grid place-items-center bg-c-100">
        <div className="rounded-lg p-4 w-80 bg-white dark:bg-gray-800 border border-c-300">
          <div className="mb-2 text-center font-medium">Enter access code</div>
          <input
            className="w-full h-8 px-2 rounded bg-c-200 no-outline"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && unlock()}
          />
          <button className="safari-btn w-full mt-2" onClick={unlock}>
            Unlock
          </button>
          {error && <div className="mt-2 text-xs text-red-500">{error}</div>}
        </div>
      </div>
    );
  }

  return children({ token, profileId });
}



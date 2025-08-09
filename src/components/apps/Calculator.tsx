import React from "react";

type Op = "+" | "-" | "*" | "/" | null;

export default function Calculator() {
  const [display, setDisplay] = useState<string>("0");
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<Op>(null);
  const [fresh, setFresh] = useState<boolean>(true);

  const input = (v: string) => {
    setDisplay((prev) => {
      const cur = fresh || prev === "0" ? v : prev + v;
      setFresh(false);
      return cur;
    });
  };

  const dot = () => {
    setDisplay((prev) => {
      const next = fresh ? "0." : prev.includes(".") ? prev : prev + ".";
      setFresh(false);
      return next;
    });
  };

  const clear = () => {
    setDisplay("0");
    setAcc(null);
    setOp(null);
    setFresh(true);
  };

  const toggleSign = () =>
    setDisplay((prev) => (prev.startsWith("-") ? prev.slice(1) : prev === "0" ? prev : "-" + prev));
  const percent = () => setDisplay((prev) => String(parseFloat(prev) / 100));
  const backspace = () => setDisplay((prev) => (fresh ? prev : prev.length > 1 ? prev.slice(0, -1) : "0"));

  const compute = (a: number, b: number, oper: Exclude<Op, null>) =>
    oper === "+" ? a + b : oper === "-" ? a - b : oper === "*" ? a * b : a / b;

  const doOp = (nextOp: Exclude<Op, null>) => {
    const cur = parseFloat(display);
    if (acc === null) setAcc(cur);
    else if (!fresh && op) setAcc(compute(acc, cur, op));
    setOp(nextOp);
    setFresh(true);
  };

  const equals = () => {
    if (op && acc !== null) {
      const cur = parseFloat(display);
      const res = compute(acc, cur, op);
      setDisplay(String(res));
      setAcc(null);
      setOp(null);
      setFresh(true);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const k = e.key;
    if (/^[0-9]$/.test(k)) input(k);
    else if (k === ".") dot();
    else if (["+", "-", "*", "/"].includes(k)) doOp(k as Exclude<Op, null>);
    else if (k === "Enter") equals();
    else if (k === "Backspace") backspace();
    else if (k.toLowerCase() === "c") clear();
  };

  const Button = ({ label, variant, onClick, span = 1 }: { label: string; variant: "num" | "op" | "util" | "eq"; onClick: () => void; span?: number }) => {
    const base = "rounded-2xl h-12 sm:h-14 flex items-center justify-center text-base select-none cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400";
    let colors = "bg-c-200 hover:bg-c-300";
    if (variant === "op") colors = "bg-amber-400 text-black hover:bg-amber-300";
    else if (variant === "util") colors = "bg-c-300 hover:bg-c-400";
    else if (variant === "eq") colors = "bg-blue-500 text-white hover:bg-blue-400";
    return (
      <button className={`${base} ${colors} ${span === 2 ? "col-span-2" : ""}`} onClick={onClick} aria-label={label}>
        {label}
      </button>
    );
  };

  const prettyOp = (o: Exclude<Op, null>) => (o === "/" ? "÷" : o === "*" ? "×" : o === "-" ? "−" : "+");

  return (
    <div className="h-full w-full bg-c-100 dark:bg-gray-900 text-c-black dark:text-white p-4 sm:p-5 overflow-auto" onKeyDown={handleKey} tabIndex={0}>
      <div className="rounded-xl bg-white/80 dark:bg-black/40 backdrop-blur px-4 py-3 shadow-sm border border-c-300 flex items-end justify-between">
        <div className="text-xs text-c-500">{op ? prettyOp(op) : "\u00A0"}</div>
        <div className="font-mono tabular-nums text-2xl sm:text-3xl">{display}</div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3 mt-3 pb-3">
        <Button label="C" variant="util" onClick={clear} />
        <Button label="±" variant="util" onClick={toggleSign} />
        <Button label="%" variant="util" onClick={percent} />
        <Button label="÷" variant="op" onClick={() => doOp('/')} />

        {["7", "8", "9"].map((n) => (
          <Button key={n} label={n} variant="num" onClick={() => input(n)} />
        ))}
        <Button label="×" variant="op" onClick={() => doOp('*')} />

        {["4", "5", "6"].map((n) => (
          <Button key={n} label={n} variant="num" onClick={() => input(n)} />
        ))}
        <Button label="−" variant="op" onClick={() => doOp('-')} />

        {["1", "2", "3"].map((n) => (
          <Button key={n} label={n} variant="num" onClick={() => input(n)} />
        ))}
        <Button label="+" variant="op" onClick={() => doOp('+')} />

        <Button label="0" variant="num" span={2} onClick={() => input('0')} />
        <Button label="." variant="num" onClick={dot} />
        <Button label="=" variant="eq" onClick={equals} />
      </div>

      <div className="mt-2 text-right text-xs text-c-500">Tips: keyboard input works (0-9, + − × ÷, Enter, Backspace, C).</div>
    </div>
  );
}



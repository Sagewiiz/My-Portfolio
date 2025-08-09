import React from "react";

type Op = "+" | "-" | "*" | "/" | null;

export default function Calculator() {
  const [display, setDisplay] = useState<string>("0");
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<Op>(null);

  const input = (v: string) => {
    setDisplay((prev) => (prev === "0" ? v : prev + v));
  };

  const clear = () => {
    setDisplay("0");
    setAcc(null);
    setOp(null);
  };

  const doOp = (nextOp: Exclude<Op, null>) => {
    const cur = parseFloat(display);
    if (acc === null) setAcc(cur);
    else {
      const res = op === "+" ? acc + cur : op === "-" ? acc - cur : op === "*" ? acc * cur : acc / cur;
      setAcc(res);
      setDisplay(String(res));
    }
    setOp(nextOp);
    setDisplay("0");
  };

  const equals = () => {
    if (op && acc !== null) {
      const cur = parseFloat(display);
      const res = op === "+" ? acc + cur : op === "-" ? acc - cur : op === "*" ? acc * cur : acc / cur;
      setDisplay(String(res));
      setAcc(null);
      setOp(null);
    }
  };

  return (
    <div className="size-full bg-c-100 text-c-black p-3">
      <div className="h-12 mb-2 rounded bg-c-white flex items-center justify-end px-3 text-xl">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {"789/456*123-0C=+".split("").map((ch, idx) => {
          const common = "rounded h-10 flex items-center justify-center select-none cursor-pointer bg-c-200 hover:bg-c-300";
          if (ch >= "0" && ch <= "9") return (
            <div key={idx} className={common} onClick={() => input(ch)}>{ch}</div>
          );
          if (ch === "C") return <div key={idx} className={common} onClick={clear}>C</div>;
          if (ch === "=") return <div key={idx} className={common} onClick={equals}>=</div>;
          const opMap: Record<string, Exclude<Op, null>> = {"/": "/", "*": "*", "+": "+", "-": "-"};
          return <div key={idx} className={`${common} bg-blue-200 hover:bg-blue-300`} onClick={() => doOp(opMap[ch])}>{ch}</div>;
        })}
      </div>
    </div>
  );
}



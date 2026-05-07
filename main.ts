type SliceParam = number | null;

interface SliceResult {
  indices: number[];
  values: unknown[];
  expression: string;
}

function pySlice<T>(
  arr: T[],
  start: SliceParam = null,
  stop: SliceParam = null,
  step: SliceParam = null
): SliceResult {
  const n = arr.length;
  const st = step ?? 1;

  if (st === 0) throw new Error("slice step cannot be zero");

  let s: number;
  let e: number;

  if (st > 0) {
    s = start === null ? 0 : start < 0 ? Math.max(0, n + start) : Math.min(n, start);
    e = stop === null ? n : stop < 0 ? Math.max(0, n + stop) : Math.min(n, stop);
  } else {
    s = start === null ? n - 1 : start < 0 ? Math.max(-1, n + start) : Math.min(n - 1, start);
    e = stop === null ? -n - 1 : stop < 0 ? Math.max(-n - 1, n + stop) : Math.min(n, stop) - 1;
  }

  const indices: number[] = [];
  if (st > 0) {
    for (let i = s; i < e; i += st) indices.push(i);
  } else {
    for (let i = s; i > e; i += st) indices.push(i);
  }

  const values = indices.map((i) => arr[i]);

  const fmtParam = (p: SliceParam): string => (p === null ? "" : String(p));
  const expression =
    step === null
      ? `[${fmtParam(start)}:${fmtParam(stop)}]`
      : `[${fmtParam(start)}:${fmtParam(stop)}:${fmtParam(step)}]`;

  return { indices, values, expression };
}

function visualize<T>(arr: T[], start: SliceParam, stop: SliceParam, step: SliceParam): void {
  const result = pySlice(arr, start, stop, step);
  const selectedSet = new Set(result.indices);
  const n = arr.length;

  const posRow = arr.map((_, i) => String(i).padStart(4)).join("");
  const valRow = arr.map((v, i) => (selectedSet.has(i) ? `[${v}]` : ` ${v} `).padStart(4)).join("");
  const negRow = arr.map((_, i) => String(i - n).padStart(4)).join("");

  console.log(`\nq${result.expression}`);
  console.log(posRow);
  console.log(valRow);
  console.log(negRow);
  console.log(`\n→ [${result.values.join(", ")}]\n`);
}

const q = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

visualize(q, null, null, null);    // q[::]   → all
visualize(q, 2, 5, null);          // q[2:5]  → 2,3,4
visualize(q, null, null, -1);      // q[::-1] → reversed
visualize(q, -3, null, null);      // q[-3:]  → last three
visualize(q, null, null, 2);       // q[::2]  → every second

export { pySlice, visualize, SliceParam, SliceResult };

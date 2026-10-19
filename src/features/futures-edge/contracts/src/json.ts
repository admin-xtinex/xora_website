/** JSON-safe value type: all authored data must be serializable (no functions, no executable content). */
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type JsonObject = { [key: string]: JsonValue };

export function isJsonValue(v: unknown, depth = 0): v is JsonValue {
  if (depth > 32) return false;
  if (v === null) return true;
  const t = typeof v;
  if (t === 'string' || t === 'boolean') return true;
  if (t === 'number') return Number.isFinite(v as number);
  if (Array.isArray(v)) return v.every((x) => isJsonValue(x, depth + 1));
  if (t === 'object') {
    const proto = Object.getPrototypeOf(v);
    if (proto !== Object.prototype && proto !== null) return false;
    return Object.values(v as object).every((x) => isJsonValue(x, depth + 1));
  }
  return false;
}
export function isJsonObject(v: unknown): v is JsonObject {
  return typeof v === 'object' && v !== null && !Array.isArray(v) && isJsonValue(v);
}

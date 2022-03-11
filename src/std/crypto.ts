export type V8Crypto = Crypto & { randomUUID(): string };

/** Generate a new UUID */
export function uuid(): string {
  return getCrypto()?.randomUUID() ?? internalUUID();
}

/** Return crypto for V8Engine */
export function getCrypto(): V8Crypto | undefined {
  const cry = crypto as unknown as V8Crypto;
  if (typeof cry.randomUUID === 'function') {
    return cry;
  }
  return undefined;
}

function internalUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random()*16|0;
    const v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

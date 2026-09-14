type Listener = () => void;

let listener: Listener | null = null;

export function registerHomeTabPressHandler(fn: Listener) {
  listener = fn;
  return () => {
    if (listener === fn) listener = null;
  };
}

export function triggerHomeTabPress() {
  listener?.();
}

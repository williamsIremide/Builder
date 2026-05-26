import React, { useEffect } from "react";

const isPC = () =>
  typeof window !== "undefined" && !/Mobi|Android/i.test(navigator.userAgent);

const ShortcutManager: React.FC<{
  shortcuts: {
    key: string;
    shift?: boolean;
    ctrl?: boolean;
    action: () => void;
  }[];
}> = ({ shortcuts }) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { shiftKey, ctrlKey, key } = event;

      const shortcut = shortcuts.find(
        (s) =>
          s.key === key &&
          (s.shift ? s.shift === shiftKey : true) &&
          (s.ctrl ? s.ctrl === ctrlKey : true),
      );

      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }
    };

    if (isPC()) {
      window.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [shortcuts]);

  return null;
};

export default ShortcutManager;

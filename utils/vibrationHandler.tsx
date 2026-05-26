const vibrate = (time: number = 100): void => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(time);
  }
};

export default vibrate;

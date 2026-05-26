import { useState, TouchEvent } from "react";

interface SwipeHandlerProps {
  swipeLeftAction?: () => void;
  swipeRightAction?: () => void;
  swipeUpAction?: () => void;
  swipeDownAction?: () => void;
}

interface SwipeHandlerResult {
  handleTouchStart: (e: TouchEvent) => void;
  handleTouchMove: (e: TouchEvent) => void;
  handleTouchEnd: () => void;
  isFooterVisible: boolean;
}

export const useSwipeHandler = ({
  swipeLeftAction = () => {},
  swipeRightAction = () => {},
  swipeUpAction = () => {},
  swipeDownAction = () => {},
}: SwipeHandlerProps): SwipeHandlerResult => {
  const MIN_SWIPE_Y_DISTANCE = 80;
  const MIN_SWIPE_X_DISTANCE = 250;
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const [startX, setStartX] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [isFooterVisible, setFooterVisible] = useState(true);

  const handleTouchStart = (e: TouchEvent) => {
    setSwipeDirection(null); // Reset the swipe direction
    setStartX(e.touches[0].clientX); // Get the initial touch X position
    setStartY(e.touches[0].clientY); // Get the initial touch Y position
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!startX || !startY) return; // If startX or startY is not set, return
    const currentX = e.touches[0].clientX; // Get the current touch X position
    const currentY = e.touches[0].clientY; // Get the current touch Y position
    const deltaX = currentX - startX; // Calculate the X distance traveled
    const deltaY = currentY - startY; // Calculate the Y distance traveled

    if (deltaX > MIN_SWIPE_X_DISTANCE) {
      setSwipeDirection("right"); // Right swipe
    } else if (deltaX < -MIN_SWIPE_X_DISTANCE) {
      setSwipeDirection("left"); // Left swipe
    }
    if (deltaY > MIN_SWIPE_Y_DISTANCE) {
      // Downward swipe (scroll down)
      setFooterVisible(true);
    } else if (deltaY < -MIN_SWIPE_Y_DISTANCE) {
      // Upward swipe (scroll up)
      setFooterVisible(false);
    }
  };

  const handleTouchEnd = () => {
    if (swipeDirection === "right" && swipeRightAction) {
      swipeRightAction();
    } else if (swipeDirection === "left" && swipeLeftAction) {
      swipeLeftAction();
    } else if (swipeDirection === "up" && swipeUpAction) {
      swipeUpAction();
    } else if (swipeDirection === "down" && swipeDownAction) {
      swipeDownAction();
    }
    setSwipeDirection(null); // Reset the swipe direction
  };

  return { handleTouchStart, handleTouchMove, handleTouchEnd, isFooterVisible };
};

export default useSwipeHandler;

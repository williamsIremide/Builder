"use client";

import { useState, useContext, createContext } from "react";

interface MobileMenuType {
  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
}

const MobileMenu = createContext<MobileMenuType>({
  isMenuOpen: false,
  openMenu: () => {},
  closeMenu: () => {},
});

/**
 * A provider component for the mobile menu.
 *
 * @param {{ children?: JSX.Element }} - The children of the component.
 * @return {JSX.Element} The provider component for the mobile menu.
 */
export const MobileMenuProvider = ({
  children,
}: {
  children?: JSX.Element;
}): JSX.Element => {
  const [isMenuOpen, setMenu] = useState<boolean>(false);

  /**
   * Opens the menu by setting its state to true.
   */
  function openMenu(): void {
    setMenu(() => true);
  }

  /**
   * Closes the menu by setting its state to false.
   */
  function closeMenu(): void {
    setMenu(() => false);
  }

  const values = { isMenuOpen, openMenu, closeMenu };

  return <MobileMenu.Provider value={values}>{children}</MobileMenu.Provider>;
};

export const useMobileMenuContext = () => useContext(MobileMenu);

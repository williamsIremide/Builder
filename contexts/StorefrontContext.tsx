import { createContext, useContext, ReactNode } from "react";
import { Storefront } from "~/constants/types";

interface CommonProps {
  url: string;
  subdomain: string;
  storefrontData: Storefront;
}

const StorefrontContext = createContext<CommonProps | null>(null);

export function StorefrontProvider({
  children,
  serverProps,
}: {
  children: ReactNode;
  serverProps: CommonProps;
}) {
  return (
    <StorefrontContext.Provider value={serverProps}>
      {children}
    </StorefrontContext.Provider>
  );
}

export function useStorefront(): CommonProps {
  const context = useContext(StorefrontContext);

  if (!context) {
    throw new Error("useStorefront must be used within a StorefrontProvider");
  }

  return context;
}

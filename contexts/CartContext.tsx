import React, { createContext, useContext, useEffect, useState } from "react";
import { Cart, CartItem } from "~/constants/types/models";
import { cartEndpoints } from "~/constants/routes";
// import { handleCartSubmit } from "../submitHandlers/cart";
import { useRouter } from "next/router";
import {
  storageHandler,
  removeFromStorage,
  resolveId,
  replaceNestedObjectWithId,
  ReplaceWithRef,
  getFromStorage,
} from "~/utils";
import { generateMockCart } from "~/utils/data/models";
import { usePaginatedData } from "~/hooks/useData";

interface CartContextType {
  loading: boolean;
  isMockMode: boolean;
  cart: Cart | null;
  subtotal: number;
  totalQuantity: number;
  addItemToCart: (item: CartItem) => void;
  removeItemFromCart: (itemId: string) => void;
  updateCartItem: (itemId: string, updates: Partial<CartItem>) => void;
  getCartItem: (itemId: number) => CartItem | null;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{
  children: React.ReactNode;
  isMockMode: boolean;
}> = ({ children, isMockMode }) => {
  const user = getFromStorage("loginResponse")?.user;
  const router = useRouter();
  const [_error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [cart, setCart] = useState<Cart | null>(null);
  const [reloadCalled, setReloadCalled] = useState(false);
  const [subtotal, setSubtotal] = useState<number>(0);

  const { data: cartData, reloadData } = usePaginatedData<Cart>({
    fetchUrl: cartEndpoints.list.route,
    shouldFetchOnMount: false,
    authorization_type: "JWT",
    deleteUrl: "",
    bulkDeleteUrl: "",
  });

  useEffect(() => {
    if (isMockMode) {
      const storedCart = getFromStorage("cart");
      if (storedCart) {
        setCart(storedCart); // let the cart-state-driven useEffect sync storage
      }
      return;
    }

    if (cartData && cartData.length > 0) {
      setCart(cartData[0]); // again, let useEffect handle the sync
    } else {
      const storedCart = getFromStorage("cart");
      if (storedCart) {
        setCart(storedCart);
      }
    }
  }, [cartData, isMockMode]);

  useEffect(() => {
    if (!cart) return;

    // Keep storage in sync always from this single source of truth
    storageHandler.set("cart", cart);

    // Update total quantity
    const total = cart.items.reduce(
      (sum, cartItem) => sum + cartItem.quantity,
      0,
    );
    setTotalQuantity(total);

    // Update subtotal
    const sub = cart.items.reduce(
      (sum, cartItem) =>
        sum + parseFloat(cartItem.item.selling_price) * cartItem.quantity,
      0,
    );
    setSubtotal(sub);
  }, [cart]);

  const submitCartIfReal = (data: Partial<Cart>, id?: string) => {
    if (isMockMode) {
      setCart(data as Cart);
      return console.warn("Mock mode active: skipping API cart submission");
    }

    // Replace nested "item" with IDs
    const serialised = {
      ...data,
      items: replaceNestedObjectWithId(data.items || [], "item"),
    } as ReplaceWithRef<Cart, "store" | "items.item">;

    console.log(serialised);
    // handleCartSubmit(
    //   serialised,
    //   router,
    //   setError,
    //   setLoading,
    //   setCart,
    //   false,
    //   id,
    // );
  };

  useEffect(() => {
    if (!isMockMode && !reloadCalled) {
      reloadData(); // Will trigger authentication if needed
      setReloadCalled(true); // flag that reload was attempted, not that reload finished, since `reloadData` is async, and not awaited
    }
  }, [isMockMode, reloadCalled]);

  const createNewCart = (item: CartItem): Cart | undefined => {
    if (cart) return;

    // Create only after reload has been attempted and no cart was found
    if (
      !isMockMode &&
      user &&
      reloadCalled &&
      (!cartData || cartData.length === 0)
    ) {
      const newCart: Partial<ReplaceWithRef<Cart, "store">> = {
        user: user,
        store: resolveId(getFromStorage("storefront")?.store),
        items: [item],
      };

      submitCartIfReal(newCart as Cart);

      return newCart as Cart;
    }

    // If mock mode, just use mock cart
    if (isMockMode) {
      const mockCart = generateMockCart(item);
      setCart(mockCart);
      return mockCart;
    }

    return;
  };

  const addItemToCart = (item: CartItem) => {
    if (!cart) {
      createNewCart(item);
      return;
    }

    const existingItem = cart.items.find(
      (cartItem) => resolveId(cartItem.item) == resolveId(item.item),
    );

    if (existingItem) {
      updateCartItem(resolveId(item.item) as string, {
        quantity: existingItem.quantity + item.quantity,
      });
    } else {
      const updatedCart = { ...cart, items: [...cart.items, item] };
      submitCartIfReal(updatedCart, resolveId(cart) as string);
    }
  };

  const removeItemFromCart = (itemId: string) => {
    if (!cart) return;
    const updatedItems = cart.items.filter(
      (cartItem) => resolveId(cartItem.item) != itemId,
    );
    const updatedCart = { ...cart, items: updatedItems };
    submitCartIfReal(updatedCart, resolveId(cart) as string);
  };

  const updateCartItem = (itemId: string, updates: Partial<CartItem>) => {
    // ⚠️ We intentionally do NOT sync this update to the backend.
    //
    // This function is typically used when users adjust trivial details like quantity.
    // Most users care more about *what* is in their cart, not the exact quantity right away.
    //
    // While many e-commerce platforms persist every quantity change, this often leads to laggy UIs
    // due to constant API calls. We're prioritising a **snappy, responsive experience** instead.
    //
    // 🚨 Trade-off: If the user opens the cart on another device, they might see an outdated quantity.
    // However, since quantities can always be adjusted before checkout, this is an acceptable compromise.
    //
    // Only major actions like **adding or removing items** are synced to the server immediately.
    // This makes the cart feel faster and more forgiving — aligning with real user behaviour.

    if (!cart) return;
    const updatedItems = cart.items.map((cartItem) =>
      resolveId(cartItem.item) == itemId
        ? { ...cartItem, ...updates }
        : cartItem,
    );
    const updatedCart = { ...cart, items: updatedItems };
    setCart(updatedCart);
  };

  const getCartItem = (itemId: number): CartItem | null => {
    if (!cart) return null;
    return (
      cart.items.find((cartItem) => resolveId(cartItem.item) == itemId) || null
    );
  };

  const clearCart = () => {
    setCart(null);
    setTotalQuantity(0);
    removeFromStorage("cart");
  };

  return (
    <CartContext.Provider
      value={{
        isMockMode,
        loading,
        cart,
        subtotal,
        totalQuantity,
        addItemToCart,
        removeItemFromCart,
        updateCartItem,
        getCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};

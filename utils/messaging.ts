import { getToken, Messaging } from "firebase/messaging";
import {
  NOT_FOUND_SENTINEL,
  storageHandler,
} from "./storage/localForageHanlder";

const DEVICE_TOKEN_STORAGE_KEY = "firebaseDeviceToken";

export async function getFirebaseDeviceToken(
  messaging: Messaging | undefined,
  vapidKey: string,
): Promise<string | null> {
  try {
    const storedToken = await storageHandler.get<string>(
      DEVICE_TOKEN_STORAGE_KEY,
    );

    if (storedToken !== NOT_FOUND_SENTINEL && storedToken) {
      return storedToken;
    }

    if (!messaging) {
      return null;
    }

    const token = await getToken(messaging, { vapidKey });

    if (token) {
      await storageHandler.set(DEVICE_TOKEN_STORAGE_KEY, token);
      return token;
    }

    return null;
  } catch {
    return null;
  }
}

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
export const MAX_NUM_FILES = 2;

export function formatFileSize(bytes: number): string {
  let size: string;

  if (bytes >= 1024 * 1024) {
    // Size is in MB
    size = (bytes / (1024 * 1024)).toFixed(2);
    // Remove trailing .00
    if (size.endsWith(".00")) {
      size = size.slice(0, -3);
    }
    return size + "MB";
  } else if (bytes >= 1024) {
    // Size is in KB
    size = (bytes / 1024).toFixed(2);
    // Remove trailing .00
    if (size.endsWith(".00")) {
      size = size.slice(0, -3);
    }
    return size + "KB";
  } else {
    // Size is in bytes
    return bytes + "B";
  }
}

/**
 * Creates an array of image objects with src and alt text.
 * @param images - Array of image URLs.
 * @param name - The name to be used as the alt text for the images.
 * @returns Array of objects containing src and alt properties.
 */
export function createImageObjects(
  images?: string[] | null,
  name?: string,
): { src: string; alt: string }[] {
  if (images && images.length > 0) {
    return images.map((imageUrl, index) => ({
      src: getImageSrc(imageUrl),
      alt: `${name} - ${index}`,
    }));
  } else {
    return [
      {
        src: getImageSrc(""),
        alt: `${name ? name : ""} - placeholder`,
      },
    ];
  }
}

const placeholderUrls: string[] = [
  "https:/chotcut.com/products/placeholder.jpg",
  "",
];

export const getImageSrc = (url: string): string => {
  // Check if the URL is in the list of placeholder URLs
  if (
    !url ||
    placeholderUrls.some((placeholderUrl) => url.startsWith(placeholderUrl))
  ) {
    return ""; // Return the placeholder image src
  }

  return url; // Return the original URL if no match
};

export async function getImageInfo(
  url: string,
): Promise<{ name: string; size: number }> {
  try {
    // Extract image name from URL
    const nameWithUnderscores = url.substring(url.lastIndexOf("/") + 1);

    // Reverse engineer the name to replace underscores with spaces
    const name = nameWithUnderscores.replace(/_/g, " ");

    // Fetch the image as a blob to determine the size
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const blob = await response.blob();

    // Return the name and size in bytes
    return {
      name,
      size: blob.size, // Blob size gives us the file size in bytes
    };
  } catch (error) {
    console.error("Error fetching image info:", error);
    throw error; // Rethrow to handle errors outside
  }
}

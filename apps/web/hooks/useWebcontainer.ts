import { useState, useEffect } from "react";
import { WebContainer } from "@webcontainer/api";

let webContainerInstance: WebContainer | null = null; // Singleton instance

export const useWebContainer = () => {
  const [webContainer, setWebContainer] = useState<WebContainer | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeWebContainer = async () => {
      if (!webContainerInstance) {
        try {
          webContainerInstance = await WebContainer.boot(); // Boot only once
        } catch (error) {
          console.error("Failed to boot WebContainer:", error);
        }
      }

      if (isMounted && webContainerInstance) {
        setWebContainer(webContainerInstance);
      }
    };

    initializeWebContainer();

    return () => {
      isMounted = false;
    };
  }, []);

  return webContainer;
};

import React, { createContext, useContext, useState, useEffect } from "react";
import type { CurrentCharacter } from "../types/CharacterTypes";
import { getCurrentCharacter } from "../utils/character";
import { createBackground, updateBackground } from "../utils/background";
import { reloadImageReplacements } from "../utils/imageReplacement";

type SessionContextType = {
  currentCharacter: CurrentCharacter | null;
  setCurrentCharacter: React.Dispatch<
    React.SetStateAction<CurrentCharacter | null>
  >;
  tab: number;
  setTab: React.Dispatch<React.SetStateAction<number>>;
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [currentCharacter, setCurrentCharacter] =
    useState<CurrentCharacter | null>(null);

  const [tab, setTab] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    createBackground();

    let lastURL = location.href;
    let lastCharacterName: string | undefined;
    let updateId = 0;

    async function updateCharacter() {
      const thisUpdateId = ++updateId;
      const requestedPath = location.pathname;
      void updateBackground(null);

      const character = await getCurrentCharacter(lastCharacterName);

      // Ignore results from older navigation requests.
      if (thisUpdateId !== updateId) return;

      // Ignore results if the user navigated somewhere else while loading.
      if (location.pathname !== requestedPath) return;

      lastCharacterName = character?.name;
      setCurrentCharacter(character);

      await reloadImageReplacements();

      // Only the latest navigation should trigger the background update.
      if (thisUpdateId !== updateId) return;

      await updateBackground(character);
    }

    void updateCharacter();

    const interval = setInterval(() => {
      if (location.href === lastURL) return;

      lastURL = location.href;
      void updateCharacter();
    }, 250);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    updateBackground(currentCharacter);
  }, [currentCharacter]);

  return (
    <SessionContext.Provider
      value={{
        currentCharacter,
        setCurrentCharacter,
        tab,
        setTab,
        menuOpen,
        setMenuOpen,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }

  return context;
}

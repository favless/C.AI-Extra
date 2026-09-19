import React, { createContext, useContext, useState } from "react";
import type { CurrentCharacter } from "../types/CharacterTypes";

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

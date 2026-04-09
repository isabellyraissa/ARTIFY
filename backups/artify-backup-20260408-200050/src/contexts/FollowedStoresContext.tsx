import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";

interface FollowedStoresContextType {
  followedStores: string[];
  followStore: (storeId: string, storeName: string) => void;
  unfollowStore: (storeId: string, storeName: string) => void;
  isFollowing: (storeId: string) => boolean;
  toggleFollow: (storeId: string, storeName: string) => void;
}

const FollowedStoresContext = createContext<FollowedStoresContextType | undefined>(undefined);

export const FollowedStoresProvider = ({ children }: { children: ReactNode }) => {
  const [followedStores, setFollowedStores] = useState<string[]>(() => {
    const saved = localStorage.getItem("artify-followed-stores");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("artify-followed-stores", JSON.stringify(followedStores));
  }, [followedStores]);

  const followStore = (storeId: string, storeName: string) => {
    setFollowedStores((prev) => {
      if (prev.includes(storeId)) return prev;
      toast({
        title: "Loja seguida!",
        description: `Você agora segue ${storeName}`,
      });
      return [...prev, storeId];
    });
  };

  const unfollowStore = (storeId: string, storeName: string) => {
    setFollowedStores((prev) => prev.filter((id) => id !== storeId));
    toast({
      title: "Loja removida",
      description: `Você deixou de seguir ${storeName}`,
      variant: "destructive",
    });
  };

  const isFollowing = (storeId: string) => followedStores.includes(storeId);

  const toggleFollow = (storeId: string, storeName: string) => {
    if (isFollowing(storeId)) {
      unfollowStore(storeId, storeName);
    } else {
      followStore(storeId, storeName);
    }
  };

  return (
    <FollowedStoresContext.Provider
      value={{
        followedStores,
        followStore,
        unfollowStore,
        isFollowing,
        toggleFollow,
      }}
    >
      {children}
    </FollowedStoresContext.Provider>
  );
};

export const useFollowedStores = () => {
  const context = useContext(FollowedStoresContext);
  if (!context) throw new Error("useFollowedStores must be used within FollowedStoresProvider");
  return context;
};

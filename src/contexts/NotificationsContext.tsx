import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Notification {
  id: string;
  type: "message" | "order" | "coupon" | "promotion" | "system";
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
  link?: string;
}

interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  unreadCount: number;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "message",
    title: "Nova mensagem",
    message: "Maria Silva respondeu sua dúvida sobre o produto",
    read: false,
    timestamp: new Date(Date.now() - 3600000),
    link: "/mensagens"
  },
  {
    id: "2",
    type: "order",
    title: "Pedido enviado",
    message: "Seu pedido #1234 foi enviado e está a caminho",
    read: false,
    timestamp: new Date(Date.now() - 7200000),
    link: "/cliente"
  },
  {
    id: "3",
    type: "coupon",
    title: "Cupom expirando",
    message: "Seu cupom BEMVINDO10 expira em 3 dias",
    read: true,
    timestamp: new Date(Date.now() - 86400000)
  },
  {
    id: "4",
    type: "promotion",
    title: "Promoção na loja",
    message: "Cerâmica da Maria: 20% OFF em toda a loja!",
    read: true,
    timestamp: new Date(Date.now() - 172800000),
    link: "/loja/art1"
  }
];

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem("artify-notifications");
    return saved ? JSON.parse(saved).map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) })) : mockNotifications;
  });

  useEffect(() => {
    localStorage.setItem("artify-notifications", JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        unreadCount,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) throw new Error("useNotifications must be used within NotificationsProvider");
  return context;
};

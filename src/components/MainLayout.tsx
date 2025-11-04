import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface MainLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const MainLayout = ({ children, showSidebar = true }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />
      {showSidebar ? (
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen w-full">
            <Sidebar />
            <main className="flex-1 w-full">
              <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 py-3">
                <SidebarTrigger />
              </div>
              {children}
            </main>
          </div>
        </SidebarProvider>
      ) : (
        <main className="flex-1">{children}</main>
      )}
      <Footer />
    </div>
  );
};

export default MainLayout;

import MainFeed from "@/components/u-home/MainFeed";
import Sidebar from "@/components/u-home/sideBar";

export default function Page() {
  return (
    <div className="min-h-scree">
      <div className="flex flex-col md:flex-row relative px-4 sm:px-12 space-x-0 md:space-x-8">
        <div className="w-full md:w-2/3 md:border-r mb-4 md:mb-0">
          <MainFeed />
        </div>
        <div className="hidden md:block w-1/3">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

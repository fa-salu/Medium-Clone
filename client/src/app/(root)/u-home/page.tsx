import Navbar from "@/components/Navbar/Navbar";
import MainFeed from "@/components/u-home/MainFeed";
import Sidebar from "@/components/u-home/sideBar";
export default function Page() {
  return (
    <div>
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex p-8 space-x-8">
          <div className="w-2/3">
            <MainFeed />
          </div>
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

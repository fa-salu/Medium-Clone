interface ProfileBarProps {
  selectedTab: string;
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
}

export default function ProfileBar({
  selectedTab,
  setSelectedTab,
}: ProfileBarProps) {
  return (
    <div className=" space-y-4">
      <div className="text-3xl py-6">Fasalu</div>
      <div className="flex space-x-8">
        <button
          type="button"
          className={`${
            selectedTab === "Home" ? "border-b-2 border-blue-500" : ""
          } text-lg`}
          onClick={() => setSelectedTab("Home")}
        >
          Home
        </button>
        <button
          type="button"
          className={`${
            selectedTab === "List" ? "border-b-2 border-blue-500" : ""
          } text-lg`}
          onClick={() => setSelectedTab("List")}
        >
          List
        </button>
      </div>
      <hr />
    </div>
  );
}

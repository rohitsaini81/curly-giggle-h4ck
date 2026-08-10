import { Icons } from "./icons";

const items = [
  ["Home", Icons.home], ["Search", Icons.search], ["Explore", Icons.compass],
  ["Reels", Icons.reel], ["Messages", Icons.message], ["Notifications", Icons.heart],
  ["Create", Icons.plus],
] as const;

export function SideNav() {
  return (
    <nav className="hidden h-screen w-[245px] shrink-0 flex-col border-r border-[#dbdbdb] px-3 py-8 lg:flex">
      <div className="mb-9 px-3 text-[25px] font-semibold italic tracking-[-1.5px]">Instagram</div>
      <div className="flex flex-1 flex-col gap-2">
        {items.map(([label, Icon]) => (
          <button key={label} className={`flex items-center gap-4 rounded-lg px-3 py-3 text-left transition hover:bg-[#f2f2f2] ${label === "Messages" ? "font-bold" : ""}`}>
            <span className="relative"><Icon size={25} />{label === "Messages" && <i className="absolute -right-2 -top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />}</span>
            <span>{label}</span>
          </button>
        ))}
        <button className="mt-1 flex items-center gap-4 rounded-lg px-3 py-3 text-left hover:bg-[#f2f2f2]"><span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-purple-600 text-[9px] font-bold text-white">YO</span><span>Profile</span></button>
      </div>
      <button className="flex items-center gap-4 rounded-lg px-3 py-3 text-left hover:bg-[#f2f2f2]"><Icons.menu size={25} /><span>More</span></button>
    </nav>
  );
}

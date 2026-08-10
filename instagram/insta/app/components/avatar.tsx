type AvatarProps = { name: string; color: string; size?: "sm" | "md" | "lg"; online?: boolean };

const sizes = { sm: "h-8 w-8 text-xs", md: "h-14 w-14 text-lg", lg: "h-20 w-20 text-2xl" };

export function Avatar({ name, color, size = "md", online = false }: AvatarProps) {
  return (
    <div className="relative shrink-0">
      <div className={`${sizes[size]} grid place-items-center rounded-full font-semibold text-white shadow-inner`} style={{ background: `linear-gradient(145deg, ${color}, color-mix(in srgb, ${color} 62%, #2e2e39))` }}>
        {name.split(" ").map((word) => word[0]).slice(0, 2).join("")}
      </div>
      {online && <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#19c463]" />}
    </div>
  );
}

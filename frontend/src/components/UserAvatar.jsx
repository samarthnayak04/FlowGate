// src/components/UserAvatar.jsx
// Concept: generate a consistent color from the user's name
// so the same user always gets the same color

const colors = [
  "bg-indigo-500",
  "bg-violet-500",
  "bg-pink-500",
  "bg-rose-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-blue-500",
];

// ✅ Hash the name to always get the same color for same user
function getColor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function UserAvatar({ name = "", size = "md" }) {
  const initial = name.charAt(0).toUpperCase();
  const color = getColor(name);

  const sizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
  };

  return (
    <div
      className={`${sizes[size]} ${color} rounded-full flex items-center justify-center font-semibold text-white shrink-0`}
    >
      {initial}
    </div>
  );
}

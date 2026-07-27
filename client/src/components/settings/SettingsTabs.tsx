import clsx from "clsx";

const tabs = [
  "Business",
  "Appearance",
  "Finance",
  "Security",
  "System",
  "About",
];

type Props = {
  active: string;
  onChange: (tab: string) => void;
};

export default function SettingsTabs({
  active,
  onChange,
}: Props) {
  return (
    <div className="mb-8 flex flex-wrap gap-3 border-b pb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={clsx(
            "rounded-lg px-5 py-2 transition",
            active === tab
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
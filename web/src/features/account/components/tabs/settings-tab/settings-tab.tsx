import { ChangePasswordSection } from "./sections";

const SettingsTab = () => {
  return (
    <div className="flex flex-col gap-2 shrink-0 md:flex-row">
      <ChangePasswordSection />
    </div>
  );
};

export { SettingsTab };

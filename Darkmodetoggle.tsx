import { useDarkMode, DarkModeToggle } from "./useDarkMode";

function Navbar() {
  const { isDark, toggle } = useDarkMode();
  return <DarkModeToggle isDark={isDark} onToggle={toggle} />;
}

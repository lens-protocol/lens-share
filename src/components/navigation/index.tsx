import { Bars3Icon, XCircleIcon } from "@heroicons/react/24/solid";

import { Logo } from "@/components/navigation/Logo";
import { NavButton } from "@/components/navigation/NavButton";
import { NavLink } from "@/components/navigation/NavLink";

export function Navigation() {
  return (
    <nav className="bg-gradient-to-b from-[#3f4944] to-[#2a3530] p-[1px] rounded-full">
      <h1 className="sr-only">Main navigation</h1>
      <div className="bg-[#2a3530] rounded-full h-12 px-3 sm:h-14 sm:px-4 flex flex-row gap-4 sm:gap-8 items-center ">
        <Logo className="text-lightForest" responsive />

        <div className="sm:hidden">
          <input type="checkbox" id="menu-toggle" className="hidden peer" />
          <label htmlFor="menu-toggle" aria-label="Open menu">
            <Bars3Icon className="h-8 w-8 text-lightForest" />
          </label>

          <section className="hidden peer-checked:flex fixed inset-2 bg-lightForest p-5 rounded-3xl flex-col justify-between gap-12">
            <div className="flex flex-row justify-between items-center">
              <Logo className="text-darkForest" />

              <label htmlFor="menu-toggle" aria-label="Close menu">
                <XCircleIcon className="h-12 w-12 text-darkForest" />
              </label>
            </div>

            <div className="flex flex-col h-full justify-between items-stretch text-darkForest">
              <div className="flex flex-col justify-start gap-6 items-start text-2xl">
                <NavLink href="https://www.lens.xyz">Lens</NavLink>

                <NavLink href="https://www.lens.xyz/garden">Developers</NavLink>
              </div>

              <NavButton size="lg" variant="dark" href="https://claim.lens.xyz/">
                Claim handle
              </NavButton>
            </div>
          </section>
        </div>

        <div className="hidden sm:flex flex-row gap-8 justify-between items-center text-lightForest text-sm">
          <NavLink href="https://www.lens.xyz">Lens</NavLink>

          <NavLink href="https://www.lens.xyz/garden">Developers</NavLink>

          <NavButton size="md" variant="light" href="https://claim.lens.xyz/">
            Claim handle
          </NavButton>
        </div>
      </div>
    </nav>
  );
}

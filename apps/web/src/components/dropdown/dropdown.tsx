import { ReactNode, useMemo } from "react";
import { DropdownItem, DropdownItemProps } from "./dropdown-item";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import clsx from "clsx";

interface Props {
  trigger: ReactNode;
  items: DropdownItemProps[];
  header?: ReactNode;
}

const Dropdown = ({ trigger, items, header }: Props) => {
  const visibleItems = useMemo(
    () => items.filter((item) => !item.isHidden),
    [items],
  );

  const hasItems = visibleItems.length > 0;
  if (!hasItems) {
    return null;
  }

  return (
    <Menu>
      <MenuButton>{trigger}</MenuButton>
      <MenuItems
        className={clsx(
          "z-50 min-w-[10rem] overflow-hidden rounded-md border bg-white shadow-lg transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0",
        )}
        anchor="bottom end"
        transition
      >
        {Boolean(header) && (
          <>
            <section className="p-1">{header}</section>
            <hr />
          </>
        )}
        <section className="p-1">
          {visibleItems.map(({ label, icon, onClick }) => (
            <MenuItem
              key={label}
              as={DropdownItem}
              label={label}
              icon={icon}
              onClick={onClick}
            />
          ))}
        </section>
      </MenuItems>
    </Menu>
  );
};

export { Dropdown };

import {
  ArrowDownNarrowWideIcon,
  ArrowUpNarrowWideIcon,
  Datepicker,
  Listbox,
  ListboxOption,
} from "@components";
import { AnimatePresence, motion } from "framer-motion";

const sortOptions: ListboxOption[] = [
  {
    id: "Asc",
    label: "Rozpoczęcie (rosnąco)",
    icon: <ArrowUpNarrowWideIcon />,
  },
  {
    id: "Desc",
    label: "Rozpoczęcie (malejąco)",
    icon: <ArrowDownNarrowWideIcon />,
  },
];

const initialFiltersState: Filters = {
  sortOption: sortOptions[0],
};

interface Filters {
  dateFrom?: Date;
  dateTo?: Date;
  sortOption?: ListboxOption;
}

interface Props {
  filters: Filters;
  showSorting?: boolean;
  isLoading?: boolean;
  onChange: (filters: Filters) => void;
}

const EventsFilters = ({
  filters,
  showSorting = false,
  isLoading,
  onChange,
}: Props) => {
  return (
    <div className="flex items-center gap-2 my-1">
      <Datepicker
        value={filters.dateFrom}
        size="small"
        placeholder="Wybierdz datę od"
        calendarProps={{ defaultMonth: filters.dateFrom }}
        isLoading={isLoading}
        isDisabled={isLoading}
        onChange={(value) => onChange({ ...filters, dateFrom: value })}
      />
      <Datepicker
        value={filters.dateTo}
        size="small"
        placeholder="Wybierdz datę do"
        calendarProps={{ defaultMonth: filters.dateTo }}
        isLoading={isLoading}
        isDisabled={isLoading}
        onChange={(value) => onChange({ ...filters, dateTo: value })}
      />
      <AnimatePresence>
        {showSorting && (
          <motion.div
            className="flex mb-[1px]"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
          >
            <Listbox
              size="small"
              options={sortOptions}
              value={filters.sortOption}
              onChange={(value) => onChange({ ...filters, sortOption: value })}
              isLoading={isLoading}
              isDisabled={isLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { EventsFilters, initialFiltersState, type Filters };

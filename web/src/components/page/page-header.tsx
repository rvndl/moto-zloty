import { Skeleton } from "@components/skeleton";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  title?: string;
  content?: ReactNode;
  activeTab?: string;
}

const PageHeader = ({ title, content, activeTab }: Props) => {
  return (
    <div className="flex items-center justify-between w-full">
      {title ? (
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] flex items-center gap-2">
          {title}
          {activeTab && (
            <>
              <span> - </span>
              <motion.div
                key={activeTab}
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                {activeTab}
              </motion.div>
            </>
          )}
        </h1>
      ) : (
        <Skeleton className="w-64 h-10" />
      )}
      {content}
    </div>
  );
};

export { PageHeader };

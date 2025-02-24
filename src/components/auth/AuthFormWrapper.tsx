
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AuthFormWrapperProps {
  children: ReactNode;
}

export const AuthFormWrapper = ({ children }: AuthFormWrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

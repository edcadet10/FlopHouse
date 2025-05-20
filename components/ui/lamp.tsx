"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const LampContainer = ({
  children,
  className,
  color = "cyan",
}: {
  children: React.ReactNode;
  className?: string;
  color?: "cyan" | "primary" | "secondary" | "accent";
}) => {
  // Get the correct color class based on the selected color
  const getColorClasses = () => {
    switch (color) {
      case "primary":
        return {
          from: "from-primary",
          to: "to-primary",
          bg: "bg-primary",
        };
      case "secondary":
        return {
          from: "from-secondary",
          to: "to-secondary",
          bg: "bg-secondary",
        };
      case "accent":
        return {
          from: "from-accent",
          to: "to-accent",
          bg: "bg-accent",
        };
      default:
        return {
          from: "from-cyan-500",
          to: "to-cyan-500",
          bg: "bg-cyan-500",
        };
    }
  };

  const colorClasses = getColorClasses();
  const bgColor = color === "cyan" ? "bg-slate-950" : "bg-[#05091b]"; // Very dark blue background

  return (
    <div
      className={cn(
        `relative flex min-h-screen flex-col items-center justify-center overflow-hidden ${bgColor} w-full rounded-md z-0 pt-16`,
        className
      )}
    >
      {/* Thin light at the top - positioned with spacing from the top */}
      <div className="absolute top-12 left-0 right-0 h-0.5 w-full flex justify-center">
        <div className={`${colorClasses.bg} w-[80%] h-full shadow-[0_0_15px_5px_rgba(0,200,255,0.5)]`}></div>
      </div>

      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0 mt-20">
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className={`absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic ${colorClasses.from} via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]`}
        >
          <div className={`absolute w-[100%] left-0 ${bgColor} h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]`} />
          <div className={`absolute w-40 h-[100%] left-0 ${bgColor} bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]`} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className={`absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent ${colorClasses.to} text-white [--conic-position:from_290deg_at_center_top]`}
        >
          <div className={`absolute w-40 h-[100%] right-0 ${bgColor} bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]`} />
          <div className={`absolute w-[100%] right-0 ${bgColor} h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]`} />
        </motion.div>
        <div className={`absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 ${bgColor} blur-2xl`}></div>
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
        <div className={`absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full ${colorClasses.bg} opacity-50 blur-3xl`}></div>
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className={`absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full ${colorClasses.bg} blur-2xl`}
        ></motion.div>
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className={`absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] ${colorClasses.bg}`}
        ></motion.div>

        <div className={`absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] ${bgColor}`}></div>
      </div>

      {/* Modified this to provide proper spacing for the content */}
      <div className="relative z-50 flex flex-col items-center px-5 py-20 mt-12">
        {children}
      </div>
    </div>
  );
};

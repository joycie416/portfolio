import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export { default as Button } from "./Button.vue";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-text-gray-01 text-sm font-medium transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-text-gray-04 hover:bg-primary-400",
        destructive:
          "bg-red text-text-gray-04 hover:bg-red-03 focus-visible:ring-red-02 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-gray-03 bg-background shadow-xs hover:bg-gray-01 dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-gray-09 text-text-gray-04 hover:bg-gray-08",
        ghost: "hover:bg-gray-01 dark:hover:bg-accent/50",
        link: "text-text-gray-04 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-sm gap-1.5 px-3",
        lg: "h-10 rounded-md px-5 text-md",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
export type ButtonVariants = VariantProps<typeof buttonVariants>;

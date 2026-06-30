import type { HTMLAttributes } from "vue";
import type { InputOption } from "./common";

export type InputType = "text" | "password" | "dropdown" | "checkbox";

export type InputGroupState = "success" | "error";

export interface CommonInputGroupProps {
  state?: InputGroupState;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  class?: HTMLAttributes["class"];
  containerClass?: HTMLAttributes["class"];
}

export type InputGroupProps<TValue extends string | number = string | number> =
  | (CommonInputGroupProps & { type: "text" })
  | (CommonInputGroupProps & { type: "password"; enableToggle?: boolean })
  | (CommonInputGroupProps & {
      type: "dropdown";
      options: InputOption<TValue>[];
    })
  | (CommonInputGroupProps & {
      type: "checkbox";
      options: InputOption<TValue>[];
      direction?: CheckboxDirection;
    });

export type CheckboxDirection = "horizontal" | "vertical";

export interface CheckboxGroupProps<
  TValue extends string | number = string | number,
> {
  options: InputOption<TValue>[];
  disabled?: boolean;
  state?: InputGroupState;
  direction?: CheckboxDirection;
  class?: HTMLAttributes["class"];
}

export interface DropdownProps<
  TValue extends string | number = string | number,
> {
  options: InputOption<TValue>[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  class?: HTMLAttributes["class"];
}

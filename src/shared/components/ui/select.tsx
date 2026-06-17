"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/shared/utils/cn";

const EMPTY_SELECT_VALUE = "__onesbryne_empty_select__";

export type SelectOption = {
  disabled?: boolean;
  label: string;
  value: string;
};

type SelectProps = Omit<
  React.ComponentProps<typeof SelectPrimitive.Root>,
  "children" | "defaultValue" | "name" | "onValueChange" | "value"
> & {
  className?: string;
  contentClassName?: string;
  defaultValue?: string;
  form?: string;
  id?: string;
  name?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
};

const fromRadixSelectValue = (value: string) => {
  return value === EMPTY_SELECT_VALUE ? "" : value;
};

const toRadixSelectValue = (value: string | undefined) => {
  return value ? value : EMPTY_SELECT_VALUE;
};

export const Select = ({
  className,
  contentClassName,
  defaultValue = "",
  disabled,
  form,
  id,
  name,
  onValueChange,
  options,
  placeholder = "Select",
  required,
  value,
  ...props
}: SelectProps) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const selectedValue = isControlled ? value : internalValue;

  const handleValueChange = (nextValue: string) => {
    const normalizedValue = fromRadixSelectValue(nextValue);

    if (!isControlled) {
      setInternalValue(normalizedValue);
    }

    onValueChange?.(normalizedValue);
  };

  return (
    <SelectPrimitive.Root
      defaultValue={isControlled ? undefined : toRadixSelectValue(defaultValue)}
      disabled={disabled}
      onValueChange={handleValueChange}
      required={required}
      value={isControlled ? toRadixSelectValue(value) : undefined}
      {...props}
    >
      {name ? (
        <input
          disabled={disabled}
          form={form}
          name={name}
          type="hidden"
          value={selectedValue}
        />
      ) : null}
      <SelectPrimitive.Trigger
        aria-required={required}
        className={cn(
          "focus-soft border-hairline text-foreground data-[placeholder]:text-muted-foreground/60 flex h-11 w-full items-center justify-between gap-3 border-b bg-transparent py-2 pr-1 text-left text-sm disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        id={id}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="text-muted-foreground size-3.5 shrink-0" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className={cn(
            "border-hairline bg-background z-50 max-h-80 min-w-[var(--radix-select-trigger-width)] overflow-hidden border shadow-xl",
            contentClassName,
          )}
          position="popper"
          sideOffset={6}
        >
          <SelectPrimitive.ScrollUpButton className="text-muted-foreground flex h-6 cursor-default items-center justify-center">
            <ChevronUp className="size-3.5" />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="p-1">
            <SelectPrimitive.Group>
              {options.map((option) => (
                <SelectPrimitive.Item
                  className="text-foreground data-[highlighted]:bg-surface relative flex min-h-9 cursor-default items-center py-2 pr-8 pl-3 text-sm transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  disabled={option.disabled}
                  key={option.value || "empty"}
                  value={toRadixSelectValue(option.value)}
                >
                  <SelectPrimitive.ItemText>
                    {option.label}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute right-2 inline-flex items-center">
                    <Check className="size-3.5" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Group>
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="text-muted-foreground flex h-6 cursor-default items-center justify-center">
            <ChevronDown className="size-3.5" />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
};

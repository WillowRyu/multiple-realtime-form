import React, { forwardRef } from "react";

interface InputTitleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title: string;
}

export const InputTitle = forwardRef<HTMLInputElement, InputTitleProps>(
  ({ title, ...props }: InputTitleProps, ref) => {
    return (
      <input
        onChange={() => {}}
        ref={ref}
        value={title}
        className="input-title"
        {...props}
      />
    );
  }
);

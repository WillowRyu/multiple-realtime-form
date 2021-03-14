import React, { RefObject, useEffect, useRef, useState } from "react";
import { BlockContent } from "../model";
import { moveCursorToEnd } from "../util";
import "./component.css";

interface InputBlockProps {
  blockContent: BlockContent;
  changeInput: (ref: RefObject<HTMLDivElement>, target: BlockContent) => void;
}

export const InputBlock: React.FC<InputBlockProps> = ({
  blockContent,
  changeInput,
}) => {
  const inputWrap = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<boolean>(false);

  useEffect(() => {
    if (inputWrap.current) {
      changeInput(inputWrap, blockContent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputWrap]);

  return (
    <div
      data-block-id={blockContent?.id}
      className="input-block"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && <div className="hover-border" />}
      <div
        ref={inputWrap}
        tabIndex={0}
        className="input-editable"
        data-edit-root="editable"
        suppressContentEditableWarning={true}
        contentEditable={true}
        onFocus={(e) => moveCursorToEnd(e.target)}
      >
        {blockContent?.content}
      </div>
    </div>
  );
};

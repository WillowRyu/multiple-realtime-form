import { BlockContent } from "./model";
import { v4 as uuidv4 } from "uuid";

export const generateBlock = () => {
  const id = uuidv4();
  const newBlock: BlockContent = {
    id,
    content: "",
  };
  return newBlock;
};

export const moveCursorToEnd = (el: HTMLDivElement) => {
  if (el.innerText && document.createRange) {
    window.setTimeout(() => {
      let selection = document.getSelection();
      let range = document.createRange();

      range.setStart(
        el.childNodes[el.childNodes.length - 1],
        (el.childNodes[el.childNodes.length - 1] as HTMLElement).textContent
          ?.length ?? 0
      );

      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }, 1);
  }
};

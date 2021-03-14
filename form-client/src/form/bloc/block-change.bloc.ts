import { RefObject } from "react";
import { fromEvent, merge } from "rxjs";
import { debounceTime, filter, map } from "rxjs/operators";
import { BlockContent, BlockOperations, EventType } from "../model";
import { generateBlock } from "../util";

export const blockEffect = (
  ref: RefObject<HTMLDivElement>,
  target: BlockContent,
  socket: SocketIOClient.Socket,
  updateBlock: (block: BlockContent, operation: BlockOperations) => void
) => {
  if (ref.current) {
    // KeyDown
    const keyDown$ = fromEvent<KeyboardEvent>(ref.current, "keydown").pipe(
      map((event) => {
        if (
          event.key === "Backspace" &&
          (event.target as HTMLDivElement).textContent === ""
        ) {
          const block: BlockContent = {
            id: target.id,
            content: "",
          };
          updateBlock(block, BlockOperations.DELETE);
          return {
            block,
            operation: BlockOperations.DELETE,
          };
        }
      })
    );

    // KeyPress (한글 문제)
    const keyPress$ = fromEvent<KeyboardEvent>(ref.current, "keypress").pipe(
      map((event) => {
        if (event.key === "Enter" && event.shiftKey === false) {
          event.preventDefault();
          const block = generateBlock();
          updateBlock(block, BlockOperations.CREATE);
          return {
            block,
            operation: BlockOperations.CREATE,
          };
        }
      })
    );

    // Input
    const keyInput$ = fromEvent<KeyboardEvent>(ref.current, "input").pipe(
      filter((event) => event.key !== "Enter"),
      map((event) => {
        return {
          block: {
            id: target.id,
            content: (event.target as HTMLDivElement).textContent,
          },
          operation: BlockOperations.UPDATE,
        };
      })
    );

    // merge
    return merge(keyDown$, keyInput$, keyPress$)
      .pipe(debounceTime(300))
      .subscribe((block) => {
        if (block) {
          switch (block.operation) {
            case BlockOperations.CREATE:
              socket.emit(EventType.CreateBlock, block.block);
              return;
            case BlockOperations.DELETE:
              socket.emit(EventType.DeleteBlock, block.block);
              return;
            case BlockOperations.UPDATE:
              socket.emit(EventType.PatchValue, block.block);
              return;
          }
        }
      });
  }
};

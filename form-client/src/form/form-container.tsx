import React, { RefObject, useEffect, useRef, useState } from "react";
import { ConnectedClientList, InputBlock } from "./components";
import "./form-container.css";
import { BlockContent, BlockOperations, EventType } from "./model";
import { socket } from "../core";
import { blockEffect } from "./bloc";

export const FormContainer: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [blockContents, setBlockContents] = useState<BlockContent[]>([]);
  const [blockLength, setBlockLength] = useState<number>(0);
  const [clients, setClients] = useState<string[]>([]);

  const updateBlock = (block: BlockContent, operation: BlockOperations) => {
    switch (operation) {
      case BlockOperations.CREATE:
        setBlockContents((prev) => [...prev, block]);
        setBlockLength((prev) => prev + 1);
        return;
      case BlockOperations.DELETE:
        if (block.id === "genesis-block") {
          return;
        }
        setBlockContents((prev) => prev.filter((v) => v.id !== block.id));
        setBlockLength((prev) => prev - 1);
        return;
    }
  };

  const blockUpdate = (
    ref: RefObject<HTMLDivElement>,
    target: BlockContent
  ) => {
    return blockEffect(ref, target, socket, updateBlock);
  };

  useEffect(() => {
    socket.on(EventType.Data, (payload: BlockContent[]) => {
      setBlockContents(payload);
      setBlockLength(payload.length);
    });

    socket.on(EventType.SyncValue, (payload: BlockContent[]) => {
      setBlockContents(payload);
    });

    socket.on(EventType.ClientConnected, (ids: string[]) => {
      setClients(ids);
    });
  }, []);

  useEffect(() => {
    if (formRef.current) {
      if (formRef.current.lastChild?.hasChildNodes()) {
        (formRef.current.lastChild.lastChild as HTMLDivElement).focus();
      }
    }
  }, [formRef, blockLength]);

  return (
    <div className="content-wrap">
      <div>접속자</div>
      <ConnectedClientList ids={clients} />
      <form className="form-wrap" ref={formRef}>
        {blockContents.map((v) => {
          return (
            <InputBlock blockContent={v} changeInput={blockUpdate} key={v.id} />
          );
        })}
      </form>
    </div>
  );
};

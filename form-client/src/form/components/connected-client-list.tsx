import React from "react";

interface ConnectedClientListProps {
  ids: string[];
}

export const ConnectedClientList: React.FC<ConnectedClientListProps> = ({
  ids,
}) => {
  return (
    <div className="connected-client-wrap">
      {ids.map((v) => (
        <span key={v}>{v}</span>
      ))}
    </div>
  );
};

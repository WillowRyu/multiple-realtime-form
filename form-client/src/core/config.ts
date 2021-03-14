import io from "socket.io-client";

const END_POINT = "http://localhost:3333";

export const socket = io(END_POINT);

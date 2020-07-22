import * as io from "socket.io-client";

import { chatMessages, chatMessage } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatMessages", (msgs) => {
            // console.log("last 10 messages", msgs);
            store.dispatch(chatMessages(msgs));
        });

        // socket.on("addNewCommonMessage", (msg) => {
        //     // console.log("last added message", msg);
        //     store.dispatch(newChatMessage(msg[0]));
        // });

        socket.on("chatMessage", (msg) => store.dispatch(chatMessage(msg)));
    }
};

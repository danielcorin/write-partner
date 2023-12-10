import { Message } from "./message";

export type ApplicationState = {
    messages: Message[];
    document: string,
};

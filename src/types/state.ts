import { Message } from "./message"

export type ApplicationState = {
    messages: Message[];
    document: string;
    proposedDocument: string;
    loadingResults: boolean;
};

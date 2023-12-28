import { Message } from "./message";

export type EditorContentTarget = {
  content: string;
  timestamp: number;
}

export type ApplicationState = {
  messages: Message[];
  document: string;
  proposedDocument: string;
  loadingResults: boolean;
  // we can use this hook to set the content of the rich text editor on "reject"
  rejectedDocumentHook: EditorContentTarget;
  proposingChanges: boolean;
};

import { useStore } from "../../lib/state";
import { useChat, Message } from "ai/react";
import { useCallback, useEffect, useRef, useState } from "react";
import AutoResizingTextarea from "./auto-resizing-textarea";
import MessageControls from "./message-controls";
import { EMPTY_CHANGES } from "../constants";

const MessageBlock = (
  message: Message,
  index: number,
  bgColorClass: string,
  removeMessage: () => void,
) => (
  <div key={index} className={`mx-auto ${bgColorClass} p-1 md:w-full`}>
    <div className="flex flex-wrap items-start">
      <div className="p-1 w-full flex justify-between">
        <div className="flex items-center tracking-wide text-sm text-gray-700">
          <div className="uppercase font-semibold">{message.role}</div>
          <div className="ml-1">
            <MessageControls message={message} removeMessage={removeMessage} />
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {message.createdAt?.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
      <div key={message.id} className="p-1 text-gray-600 w-full">
        {message.content}
      </div>
    </div>
  </div>
);

export default function Chat() {
  const [
    { document, proposedDocument, loadingResults, proposingChanges },
    dispatch,
  ] = useStore();
  const conversationDirectives = [
    "You are a thought partner to the user",
    "You will have a conversation with the user, asking thoughtful follow up questions about what they say",
    "You will allow the user to steer the conversation in whatever direction they choose",
    "Only provide feedback when asked",
    "Focus on following up to help the user deepen and clarify the ideas they are exploring",
  ];
  const { messages, input, handleInputChange, handleSubmit, setMessages, reload } =
    useChat({
      initialMessages: [
        {
          id: "0",
          role: "system",
          content: conversationDirectives
            .map((directive) => `- ${directive}`)
            .join("\n"),
        },
        {
          id: "1",
          role: "user",
          content: "Hi!",
        },
        {
          id: "2",
          role: "assistant",
          content: "What would you like to write about?",
        },
      ],
      onResponse: analyzeChat,
    });

  const removeMessageById = useCallback(
    (idToRemove: string) => {
      setMessages(messages.filter((message) => message.id !== idToRemove));
    },
    [messages, setMessages],
  );

  const setDocument = useCallback(
    (document: string) => {
      dispatch({ type: "setDocument", document: document });
    },
    [dispatch],
  );

  const setProposedDocument = useCallback(
    (document: string) => {
      dispatch({ type: "setProposedDocument", document });
    },
    [dispatch],
  );

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch({ type: "setLoadingResults", loadingResults: loading });
    },
    [dispatch],
  );

  const setProposingChanges = useCallback(
    (proposingChanges: boolean) => {
      dispatch({
        type: "setProposingChanges",
        proposingChanges: proposingChanges,
      });
    },
    [dispatch],
  );

  const setRejectedDocumentHook = useCallback(
    (document: string) => {
      dispatch({
        type: "setRejectedDocumentHook",
        rejectedDocumentHook: {
            content: document,
            timestamp: Date.now(),
        }
      });
    },
    [dispatch],
  );

  const analysisChat = useChat({
    onFinish: (_message: Message) => {
      setLoading(false);
    },
  });

  useEffect(() => {
    if (
      analysisChat.messages.length > 0 &&
      analysisChat.messages[analysisChat.messages.length - 1].role ===
        "assistant"
    ) {
      setProposingChanges(true);
      setProposedDocument(
        analysisChat.messages[analysisChat.messages.length - 1].content,
      );
    }
  }, [analysisChat.messages, setProposedDocument, setProposingChanges]);

  const formRef = useRef(null);

  function analyzeChat(_response: Response) {
    let directives = ["You are a document creator and editor"];
    if (document) {
      directives.push(
        "Your job is to continuously synthesize a user's ideas into a document",
      );
      directives.push(
        "Your top priority is to capture the ideas articulated by the user",
      );
      directives.push(
        "The following messages contain a conversation with a user and a working document draft",
      );
      directives.push(
        "Make _minor changes_ to the document to incorporate the user's most recent ideas",
      );
    } else {
      directives.push(
        "Create a very short initial paragraph as a start of a document, incorporating the user's thoughts",
      );
    }

    directives = [
      ...directives,
      ...[
        "Preserve tone of the user's written voice but fix minor mistakes and typos where applicable",
        "Write each sentence on a separate line to make it easier to see the difference between the old version and the modified version",
        "Write content from the perspective of the user",
        "Write the content in markdown",
        "Do not ask follow up questions",
        "Output the augmented document only",
      ],
    ];

    const conversationMessages = [
      ...messages,
      {
        role: "user",
        content: input,
      },
    ];
    const conversation = conversationMessages
      .slice(1)
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");
    const analysisMessages: Message[] = [
      {
        id: "0",
        role: "system",
        content: directives.map((obj) => `- ${obj}`).join("\n"),
      },
      {
        id: "1",
        role: "user",
        content: `Here is the conversation:\n${conversation}`,
      },
    ];
    if (document) {
      analysisMessages.push({
        id: "last",
        role: "user",
        content: `Here is the existing document:\n${document}`,
      });
    }
    analysisChat.setMessages(analysisMessages);
    analysisChat.reload();
  }

  const messageBlocks = messages
    .map((message: Message, index: number) => {
      const removeMessage = () => removeMessageById(message.id);
      if (message.role === "user") {
        return MessageBlock(message, index, "bg-gray-200", removeMessage);
      } else if (message.role === "assistant") {
        return MessageBlock(message, index, "bg-gray-100", removeMessage);
      }
    })
    .filter(Boolean);

  return (
    <div>
      <div className="flex flex-col justify-between h-full">
        <div className="overflow-y-auto mb-16">{messageBlocks}</div>
        <div className="fixed bottom-0 mx-auto bg-gray-300 mt-6 md:w-full">
          <div className="flex justify-between items-center w-full">
            {loadingResults || !proposingChanges ? (
              <form ref={formRef} onSubmit={handleSubmit}>
                <AutoResizingTextarea
                  formRef={formRef}
                  handleSubmit={(e) => {
                    setLoading(true);
                    setRejectedDocumentHook(EMPTY_CHANGES);
                    handleSubmit(e);
                  }}
                  input={input}
                  handleInputChange={handleInputChange}
                  loading={loadingResults}
                />
              </form>
            ) : (
              <div className="py-2">
                <div className="flex justify-between">
                  <button
                    className="px-2 py-1 mr-1"
                    onClick={() => {
                      setProposingChanges(false);
                      setDocument(proposedDocument);
                      setProposedDocument("");
                    }}
                  >
                    Keep
                  </button>
                  <button
                    className="px-2 py-1 ml-1"
                    onClick={() => {
                      setProposingChanges(false);
                      setRejectedDocumentHook(document);
                      setLoading(true);
                      analysisChat.setMessages(analysisChat.messages.slice(0, -1));
                      analysisChat.reload();
                    }}
                  >
                    Regenerate
                  </button>
                  <button
                    className="px-2 py-1 ml-1"
                    onClick={() => {
                      setProposingChanges(false);
                      setRejectedDocumentHook(document);
                    }}
                  >
                    Pass
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

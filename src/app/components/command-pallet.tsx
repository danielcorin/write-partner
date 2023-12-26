import "react-cmdk/dist/cmdk.css";
import CommandPalette, { filterItems, getItemIndex } from "react-cmdk";
import { useEffect, useState } from "react";
import { BsCopy, BsDownload, BsRobot  } from "react-icons/bs";
import FileService from "../services/file-service";
import ClipboardService from "../services/clipboard-service";
import { useStore } from "@/lib/state";

const CommandPallet = () => {
    const [page, setPage] = useState<"root" | "projects">("root");
    const [open, setOpen] = useState<boolean>(false);
    const [ store, _ ] = useStore()
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.metaKey && e.key === "k") {
                e.preventDefault();
                e.stopPropagation();

                setOpen((currentValue: boolean) => {
                    return !currentValue;
                });
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    const [search, setSearch] = useState("");

    const filteredItems = filterItems(
        [
            {
                heading: "Language Model",
                id: "lm",
                items: [
                    {
                        id: "generate_document_edits",
                        children: "Generate document edits",
                        icon: () => <BsRobot className="text-gray-400" />,
                        onClick: () => {
                            console.log("make edits")
                        },
                    },
                ],
            },
            {
                heading: "Actions",
                id: "actions",
                items: [
                    {
                        id: "download",
                        children: "Download Document",
                        icon: () => <BsDownload className="text-gray-400" />,
                        onClick: () => {
                            FileService.downloadStringAsFile(
                                store.proposedDocument || store.document, "text/markdown")
                        },
                    },
                    {
                        id: "copy",
                        children: "Copy Document",
                        icon: () => <BsCopy className="text-gray-400" />,
                        onClick: () => {
                            ClipboardService.copyToClipboard(store.proposedDocument || store.document)
                        },
                    },
                ],
            },
        ],
        search,
    );

    return (
        <CommandPalette
            onChangeSearch={setSearch}
            onChangeOpen={setOpen}
            search={search}
            isOpen={open}
            page={page}
        >
            <CommandPalette.Page id="root">
                {filteredItems.length ? (
                    filteredItems.map((list) => (
                        <CommandPalette.List key={list.id} heading={list.heading}>
                            {list.items.map(({ id, ...rest }) => (
                                <CommandPalette.ListItem
                                    key={id}
                                    index={getItemIndex(filteredItems, id)}
                                    {...rest}
                                />
                            ))}
                        </CommandPalette.List>
                    ))
                ) : (
                    <CommandPalette.FreeSearchAction />
                )}
            </CommandPalette.Page>

            <CommandPalette.Page id="projects">
                {/* Projects page */}
            </CommandPalette.Page>
        </CommandPalette>
    );
};

export default CommandPallet;

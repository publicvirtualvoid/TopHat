import { LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterLuxon";
import { CssBaseline, StyledEngineProvider, Theme, ThemeProvider } from "@mui/material";
import { noop, omit } from "lodash-es";
import { SnackbarProvider } from "notistack";
import React from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Provider } from "react-redux";
import { TopHatStore } from "../../state";
import { handleStatementFileUpload } from "../../state/logic/statement";
import { theme } from "../../styles/theme";
import { TopHatDialog } from "../dialog";

// This is necessary to ensure that the DefaultTheme used by typescript fully inherits everything from Theme
declare module "@mui/styles/defaultTheme" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

export const FileHandlerContext = React.createContext<{
    openFileDialog: () => void;
    acceptedFiles: File[];
    fileRejections: FileRejection[];
    isDragActive: boolean;
    dropzoneRef: React.RefObject<HTMLElement> | null;
}>({
    openFileDialog: noop,
    acceptedFiles: [],
    fileRejections: [],
    isDragActive: false,
    dropzoneRef: null,
});

export const Workspace: React.FC = ({ children }) => {
    const {
        open: openFileDialog,
        acceptedFiles,
        fileRejections,
        getRootProps,
        getInputProps,
        isDragActive,
        rootRef: dropzoneRef,
    } = useDropzone({
        accept: "text/csv",
        onDrop: handleStatementFileUpload,
    });

    return (
        <>
            <CssBaseline />
            <SnackbarProvider>
                <LocalizationProvider
                    dateAdapter={
                        // Typescript thinks that some functions are missing in DateAdapter
                        // This seems just to be a bug in the type definitions
                        DateAdapter as any
                    }
                >
                    <StyledEngineProvider injectFirst>
                        <ThemeProvider theme={theme}>
                            <FileHandlerContext.Provider
                                value={{ openFileDialog, acceptedFiles, fileRejections, isDragActive, dropzoneRef }}
                            >
                                <Provider store={TopHatStore}>
                                    <div {...omit(getRootProps(), ["onClick"])}>
                                        <TopHatDialog />
                                        <input
                                            id="file-upload-dropzone"
                                            {...getInputProps({ style: { display: "none" } })}
                                        />
                                        {children}
                                    </div>
                                </Provider>
                            </FileHandlerContext.Provider>
                        </ThemeProvider>
                    </StyledEngineProvider>
                </LocalizationProvider>
            </SnackbarProvider>
        </>
    );
};

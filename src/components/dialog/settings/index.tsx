import { CloudDone, Edit, GetApp, ListAlt, Timeline } from "@mui/icons-material";
import { List, ListItemIcon, ListSubheader, MenuItem } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { get } from "lodash";
import React from "react";
import { TopHatDispatch, TopHatStore } from "../../../state";
import { AppSlice } from "../../../state/app";
import { useDialogState } from "../../../state/app/hooks";
import { useSelector } from "../../../state/utilities/hooks";
import { Greys } from "../../../styles/colours";
import { zipObject } from "../../../utilities/data";
import { withSuppressEvent } from "../../../utilities/events";
import { PaddedListItemText } from "../../display/ListItems";
import { DialogContents, DialogMain, DialogOptions } from "../utilities";
import { DialogExportContents, DialogImportContents } from "./data";
import { DialogSummaryContents } from "./summary";

const useStyles = makeStyles({
    list: {
        "& > li": {
            paddingLeft: 20,
            paddingRight: 20,
        },
    },
    subheader: { background: Greys[200] },
});
export const DialogSettingsView: React.FC = () => {
    const classes = useStyles();
    const page = useDialogState("settings");
    const isDemo = useSelector((state) => state.data.user.isDemo);

    return (
        <DialogMain>
            <DialogOptions>
                <List className={classes.list}>
                    <ListSubheader className={classes.subheader}>Data</ListSubheader>
                    <MenuItem onClick={setEmptyPage} selected={page === undefined}>
                        <ListItemIcon>
                            <ListAlt fontSize="small" />
                        </ListItemIcon>
                        <PaddedListItemText>{isDemo ? "Demo" : "Summary"}</PaddedListItemText>
                    </MenuItem>
                    <MenuItem onClick={setPage["import"]} selected={page === "import"}>
                        <ListItemIcon>
                            <Edit fontSize="small" />
                        </ListItemIcon>
                        <PaddedListItemText>Manage Data</PaddedListItemText>
                    </MenuItem>
                    <MenuItem onClick={setPage["export"]} selected={page === "export"}>
                        <ListItemIcon>
                            <GetApp fontSize="small" />
                        </ListItemIcon>
                        <PaddedListItemText>Export</PaddedListItemText>
                    </MenuItem>
                    <ListSubheader className={classes.subheader}>Settings</ListSubheader>
                    <MenuItem onClick={setPage["storage"]} selected={page === "storage"}>
                        <ListItemIcon>
                            <CloudDone fontSize="small" />
                        </ListItemIcon>
                        <PaddedListItemText>Storage and Services</PaddedListItemText>
                    </MenuItem>
                    <MenuItem onClick={setPage["budgeting"]} selected={page === "budgeting"}>
                        <ListItemIcon>
                            <Timeline fontSize="small" />
                        </ListItemIcon>
                        <PaddedListItemText>Budgeting</PaddedListItemText>
                    </MenuItem>
                </List>
            </DialogOptions>
            <DialogContents>{get(Pages, page || "", <DialogSummaryContents />)}</DialogContents>
        </DialogMain>
    );
};

const pages = ["import", "export", "storage", "budgeting"] as const;
const setPage = zipObject(
    pages,
    pages.map((page) =>
        withSuppressEvent(() =>
            TopHatDispatch(
                AppSlice.actions.setDialogPartial({
                    settings: page === TopHatStore.getState().app.dialog.settings ? undefined : page,
                })
            )
        )
    )
);
const setEmptyPage = () => TopHatDispatch(AppSlice.actions.setDialogPartial({ settings: undefined }));

const Pages = {
    import: <DialogImportContents />,
    export: <DialogExportContents />,
};

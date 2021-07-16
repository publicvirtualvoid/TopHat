import { makeStyles } from "@material-ui/core";
import numeral from "numeral";
import { Greys } from "../../../styles/colours";

const DEFAULT_ROW_HEIGHT = 50;
const CENTERED_CONTAINER = {
    height: DEFAULT_ROW_HEIGHT,
    display: "flex",
    alignItems: "center",
};
const ICON_BUTTON = {
    "& > svg": {
        margin: 3,
    },

    "& > button": {
        minWidth: "auto",
        padding: 2,
        // color: Greys[600],

        // "&:not(.MuiButton-outlinedPrimary)": {
        //     border: "1px solid transparent",
        // },

        "& .MuiButton-endIcon": {
            margin: 0,
        },
    },
};
const MIXED_PLACEHOLDER = {
    opacity: 1,
    fontStyle: "italic",
    color: Greys[500],
    overflow: "visible",
    fontWeight: 300,
};

export const useTransactionsTableStyles = makeStyles((theme) => ({
    // Overall container layout
    container: {
        display: "flex",
        alignItems: "flex-start",
        padding: "0 5px",
        ...theme.typography.body1,
        transition: theme.transitions.create(["box-shadow"]),

        borderBottom: "1px solid " + Greys[200],
        "&:last-child": {
            borderBottomColor: "transparent",
        },

        "& p": {
            lineHeight: "1 !important",
        },
    },
    selectedHeaderContainer: {
        boxShadow: theme.shadows[5],
    },
    rowGroupContainer: {
        marginTop: 20,
        borderRadius: 10,
        padding: 0,
    },
    rowContainer: {
        "& > div:last-child": {
            visibility: "hidden",
        },
        "&:hover > div:last-child": {
            visibility: "inherit",
        },
    },

    // Component containers
    checkbox: {
        ...CENTERED_CONTAINER,
    },
    transfer: {
        margin: "0 5px",
        ...CENTERED_CONTAINER,
        ...ICON_BUTTON,
    },
    date: {
        width: 120,
        paddingLeft: 5,
        marginRight: 10,
        flexGrow: 0,
        ...CENTERED_CONTAINER,
    },
    text: {
        width: 150,
        flexGrow: 4,
        margin: "17px 10px 10px 0",
    },
    summary: { fontWeight: 500, overflow: "visible" },
    description: {
        marginTop: 5,
        lineHeight: 1.4,
        color: Greys[700],
    },
    value: {
        width: 110,
        marginRight: 20,
        flexGrow: 1,
        ...CENTERED_CONTAINER,
        justifyContent: "flex-end",
    },
    category: {
        width: 130,
        flexGrow: 1,
        ...CENTERED_CONTAINER,

        "& > div > div > svg": {
            visibility: "hidden",
        },
    },
    categoryIcon: {
        height: 16,
        width: 16,
        borderRadius: "50%",
        marginRight: 6,
        border: "1px solid",
    },
    balance: {
        width: 110,
        marginLeft: 10,
        flexGrow: 1,
        ...CENTERED_CONTAINER,
        justifyContent: "flex-end",
    },
    statement: {
        margin: "0 15px",
        ...CENTERED_CONTAINER,
        ...ICON_BUTTON,
    },
    account: {
        width: 170,
        flexGrow: 1,
        ...CENTERED_CONTAINER,
    },
    accountIcon: {
        height: 18,
        width: 18,
        borderRadius: 5,
        marginRight: 6,
    },
    actions: {
        width: 100,
        padding: "0 5px",
        ...CENTERED_CONTAINER,
        justifyContent: "flex-end",

        "& > *": {
            marginLeft: 5,
        },
    },

    // Utility classes
    compound: {
        display: "flex",
        alignItems: "center",
    },
    subtext: {
        color: Greys[500],
        alignSelf: "flex-end",
        margin: "0 4px",
    },
    missing: {
        fontStyle: "italic",
        color: Greys[500],
        overflow: "visible",
    },
    disabledIcon: {
        opacity: 0.3,
    },
    iconButton: {
        minWidth: "auto",
        padding: 0,

        "& .MuiButton-endIcon": {
            margin: 0,
        },
    },
    mixed: MIXED_PLACEHOLDER,
    mixedPlaceholder: { "&::placeholder": MIXED_PLACEHOLDER },
}));

export const formatTransactionsTableNumber = (value: number) => numeral(value).format("0,0.00");

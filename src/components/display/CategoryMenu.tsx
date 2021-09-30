import { ListItemText, MenuItem } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Dictionary } from "@reduxjs/toolkit";
import React, { useCallback, useMemo } from "react";
import { updateListSelection, zipObject } from "../../shared/data";
import { withSuppressEvent } from "../../shared/events";
import { Category, PLACEHOLDER_CATEGORY_ID } from "../../state/data";
import { useCategoryIDs, useCategoryMap } from "../../state/data/hooks";
import { TRANSFER_CATEGORY_ID } from "../../state/data/shared";
import { ID } from "../../state/shared/values";
import { getCategoryIcon } from "./ObjectDisplay";

const useStyles = makeStyles({
    base: {
        display: "flex",
        alignItems: "center",
        height: 32,
    },
    icon: {
        height: 16,
        width: 16,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: "50%",
    },
    checkbox: {
        marginLeft: "auto",
    },
});

interface Anchor {
    id: ID;
    include?: boolean;
}

interface SingleCategoryMenuProps {
    selected?: ID;
    setSelected: (category?: Category) => void;
    exclude?: ID[];
    anchor?: Anchor;
}
export const SingleCategoryMenuFunction = (
    { selected, setSelected, exclude = [], anchor }: SingleCategoryMenuProps,
    ref: React.ForwardedRef<HTMLDivElement>
) => {
    const ids = useCategoryIDs() as ID[];
    const entities = useCategoryMap();
    const { options, graph } = getCategoryGraph(ids, entities, exclude, anchor);

    const classes = useStyles();
    const render = useCallback(
        (category: Category) => (
            <div className={classes.base}>
                {getCategoryIcon(category, classes.icon)}
                <ListItemText>{category.name}</ListItemText>
            </div>
        ),
        [classes]
    );

    const generateMenuItems = (id: ID, depth: number = 0) =>
        graph[id].map((subitem) => (
            <React.Fragment key={subitem}>
                <MenuItem
                    dense={true}
                    style={{ marginLeft: 36 + 15 * depth }}
                    selected={subitem === selected}
                    onClick={withSuppressEvent<HTMLLIElement>(() =>
                        setSelected(subitem === selected ? undefined : entities[subitem])
                    )}
                >
                    {entities[subitem]!.name}
                </MenuItem>
                {generateMenuItems(subitem, depth + 1)}
            </React.Fragment>
        ));

    return (
        <div ref={ref}>
            {options.map((id) => (
                <React.Fragment key={id}>
                    <MenuItem
                        style={graph[id].length ? { paddingBottom: 0 } : undefined}
                        selected={id === selected}
                        onClick={withSuppressEvent<HTMLLIElement>(() =>
                            setSelected(id === selected ? undefined : entities[id]!)
                        )}
                    >
                        {render(entities[id]!)}
                    </MenuItem>
                    {generateMenuItems(id)}
                </React.Fragment>
            ))}
        </div>
    );
};

interface MultiCategoryMenuProps {
    selected: ID[];
    setSelected: (ids: ID[]) => void;
    exclude?: ID[];
    anchor?: Anchor;
}
const MultipleCategoryMenuFunction = (
    { selected, setSelected, exclude = [], anchor }: MultiCategoryMenuProps,
    ref: React.ForwardedRef<HTMLDivElement>
) => {
    const ids = useCategoryIDs() as ID[];
    const entities = useCategoryMap();
    const { options, graph } = getCategoryGraph(ids, entities, exclude, anchor);

    const classes = useStyles();
    const render = useCallback(
        (category: Category) => (
            <div className={classes.base}>
                {getCategoryIcon(category, classes.icon)}
                <ListItemText>{category.name}</ListItemText>
            </div>
        ),
        [classes]
    );

    const generateMenuItems = (id: ID, depth: number = 0) =>
        graph[id].map((subitem) => (
            <React.Fragment key={subitem}>
                <MenuItem
                    dense={true}
                    selected={selected.includes(subitem)}
                    style={{ paddingLeft: 52 + 15 * depth }}
                    onClick={withSuppressEvent<HTMLLIElement>(() =>
                        setSelected(updateListSelection(subitem, selected))
                    )}
                >
                    {entities[subitem]!.name}
                    {/* <Checkbox
                        checked={selected.includes(subitem)}
                        color="primary"
                        size="small"
                        className={classes.checkbox}
                    /> */}
                </MenuItem>
                {generateMenuItems(subitem, depth + 1)}
            </React.Fragment>
        ));

    return (
        <div ref={ref}>
            {options.map((id) => (
                <React.Fragment key={id}>
                    <MenuItem
                        style={graph[id].length ? { paddingBottom: 0 } : undefined}
                        selected={selected.includes(id)}
                        onClick={withSuppressEvent<HTMLLIElement>(() => setSelected(updateListSelection(id, selected)))}
                    >
                        {render(entities[id]!)}
                        {/* <Checkbox
                            checked={selected.includes(id)}
                            color="primary"
                            size="small"
                            className={classes.checkbox}
                        /> */}
                    </MenuItem>
                    {generateMenuItems(id)}
                </React.Fragment>
            ))}
        </div>
    );
};

export const SingleCategoryMenu: React.FC<SingleCategoryMenuProps> = React.forwardRef(SingleCategoryMenuFunction);
export const MultipleCategoryMenu: React.FC<MultiCategoryMenuProps> = React.forwardRef(MultipleCategoryMenuFunction);

export const useCategoryGraph = (exclude: ID[] = [PLACEHOLDER_CATEGORY_ID, TRANSFER_CATEGORY_ID], anchor?: Anchor) => {
    const ids = useCategoryIDs() as ID[];
    const entities = useCategoryMap();
    const { options, graph } = useMemo(
        () => getCategoryGraph(ids, entities, exclude, anchor),
        [ids, entities, exclude, anchor]
    );
    return { options, graph, entities };
};
export const getCategoryGraph = (ids: ID[], entities: Dictionary<Category>, exclude: ID[], anchor?: Anchor) => {
    ids = ids.filter((id) => !exclude.includes(id));
    if (anchor !== undefined)
        ids = ids.filter(
            (id) => entities[id]!.hierarchy.includes(anchor.id) || (anchor.include ? id === anchor.id : false)
        );

    const isRootCategory = (id: ID) => (anchor?.include ? id === anchor.id : entities[id]!.hierarchy[0] === anchor?.id);

    const graph = zipObject(
        ids,
        ids.map((_) => [] as ID[])
    );
    ids.forEach((option) => {
        if (!isRootCategory(option)) graph[entities[option]!.hierarchy[0]].push(option);
    });

    return {
        options: ids.filter(isRootCategory),
        graph,
    };
};

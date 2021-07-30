import { Menu, MenuItem, MenuProps, Typography } from "@material-ui/core";
import React from "react";
import { ID } from "../../state/utilities/values";
import { useDivBoundingRect, usePopoverProps } from "../../utilities/hooks";

export interface ObjectSelectorCommonProps<Option extends { id: ID; name: string }> {
    options: Option[];
    render: (option: Option) => React.ReactNode;
    MenuProps?: Partial<MenuProps>;
    children: React.ReactElement<{ onClick: () => void; ref: React.Ref<any> }>;
}
interface ObjectSelectorNonNullProps {
    selected: number;
    setSelected: (id: ID) => void;
    placeholder?: undefined;
}
interface ObjectSelectorNullableProps {
    selected?: number | undefined;
    setSelected: (id?: ID) => void;
    placeholder: React.ReactNode;
}
export const ObjectSelector = <Nullable extends boolean, Option extends { id: ID; name: string }>({
    options,
    render,
    MenuProps,
    children,

    selected,
    setSelected,
    placeholder,
}: ObjectSelectorCommonProps<Option> &
    (Nullable extends true ? ObjectSelectorNullableProps : ObjectSelectorNonNullProps)) => {
    const popover = usePopoverProps();
    const [{ width }, ref] = useDivBoundingRect(popover.buttonProps.ref);

    const childrenWithPopoverProps = React.cloneElement(children, { onClick: popover.buttonProps.onClick, ref });

    return (
        <>
            {childrenWithPopoverProps}
            <Menu
                {...popover.popoverProps}
                {...MenuProps}
                PaperProps={{
                    ...MenuProps?.PaperProps,
                    style: { maxHeight: 300, width: Math.max(width, 200), ...MenuProps?.PaperProps?.style },
                }}
            >
                {placeholder && (
                    <MenuItem selected={selected === undefined} onClick={() => (setSelected as () => void)()}>
                        {placeholder}
                    </MenuItem>
                )}
                {options.map((option) => (
                    <MenuItem key={option.id} selected={option.id === selected} onClick={() => setSelected(option.id)}>
                        {render(option)}
                        <Typography variant="body1" noWrap={true}>
                            {option.name}
                        </Typography>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

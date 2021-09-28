import { FormControlLabel, Switch } from "@mui/material";
import React from "react";
import { TableContainer } from "../../../components/table";
import { TopHatDispatch } from "../../../state";
import { AppSlice } from "../../../state/app";
import { useAccountsPageState } from "../../../state/app/hooks";
import { useAccountsTableData } from "./data";
import { AccountsTableHeader } from "./header";
import { AccountsInstitutionDisplay } from "./institution";

export const AccountsTable: React.FC = () => {
    const filterInactive = useAccountsPageState((state) => state.filterInactive);
    const institutions = useAccountsTableData();

    return (
        <TableContainer
            title="All Accounts"
            headers={
                <FormControlLabel
                    control={<Switch checked={filterInactive} onChange={handleToggle} />}
                    label="Filter Inactive"
                />
            }
        >
            <AccountsTableHeader />
            {institutions.map((institution) => (
                <AccountsInstitutionDisplay key={institution.id} institution={institution} />
            ))}
        </TableContainer>
    );
};

const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) =>
    TopHatDispatch(AppSlice.actions.setAccountsPagePartial({ filterInactive: event.target.checked }));

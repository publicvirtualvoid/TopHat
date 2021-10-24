import { Box, Typography } from "@mui/material";
import { Greys } from "../../styles/colours";

export const SettingsDialogPage: React.FC<{ title: string }> = ({ title, children }) => (
    <Box sx={{ width: 450, margin: "30px auto", display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <Typography variant="h6" sx={{ marginBottom: 20 / 8, color: Greys[600] }}>
            {title}
        </Typography>
        {children}
    </Box>
);

export const SettingsDialogDivider: React.FC = () => (
    <Box sx={{ background: Greys[300], height: "1px", width: "60%", margin: "20px auto 20px auto" }} />
);

export const SettingsDialogContents: React.FC = ({ children }) => (
    <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            overflowY: "auto",
            overflowX: "hidden",
            flex: "1 1 0",
        }}
    >
        {children}
    </Box>
);

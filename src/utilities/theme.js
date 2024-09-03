import { createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';

const theme = createMuiTheme({
    palette: {
        primary: green,
        secondary: amber,
        type: "dark"
    },
    spacing: {
        unit: 1
    },
    typography: { useNextVariants: true }
});

export default theme
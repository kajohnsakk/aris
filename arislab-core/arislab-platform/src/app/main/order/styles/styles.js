const pink = "#e83490";

const styles = theme => ({
    table: {
        fontFamily: "inherit"
    },
    tableCell: {
        padding: "4px"
    },
    invertedButton: {
        background: "#ffffff",
        color: pink,
        // fontWeight: 'bold',
        border: "1px solid #e83490",
        "&:hover": {
            background: "#ffffff",
            color: "#e83490",
            // fontWeight: 'bold',
            border: "1px solid #e83490"
        }
    },
    tooltipDotBadge: {
        width: 20,
        alignItems: 'flex-end',
        color: pink,
        marginLeft: 4
    },
    tooltip: {
        fontSize: '14px',
        fontFamily: 'inherit'
    }
});

export default styles;
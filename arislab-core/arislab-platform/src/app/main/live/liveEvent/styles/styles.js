
const styles = theme => ({
    loadingPage: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: "100%"
    },
    card: {
        backgroundColor: '#fff',
        maxWidth: '100%',
        [theme.breakpoints.up('lg')]: {
            paddingBottom: theme.spacing.unit,
            // border: 'solid 1px #ededed',
            overflow: 'hidden',
            boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)',
            borderRadius: '4px',
            border: '2px solid transparent'
        }
    },
    cardHeader: {
        background: '#fbfbfb',
        borderBottom: 'solid 2px #ededed',
        color: '#8d9095',
        fontWeight: 'bolder'
    },
    liveEventCardHeader: {
        background: '#ffffff',
        borderBottom: 'solid 1px #ED3590',
        color: '#000000',
        fontWeight: 'bolder',
        [theme.breakpoints.up('lg')]: {
            borderBottom: 'solid 2px #ED3590'
        }
    },
    cardContent: {
        background: '#ffffff',
        // paddingTop: theme.spacing.unit,
        // paddingBottom: theme.spacing.unit,
        padding: '0px',
        [theme.breakpoints.up('lg')]: {
            padding: theme.spacing.unit * 2
        }
    },
    createNewLiveEventBigBtn: {
        border: '2px dashed #BDBDBD',
        borderRadius: '10px',
        width: '100%',
        backgroundColor: '#ffffff',
        color: '#BDBDBD',
    },
    donwloadCardContent: {
        backgroundImage: "url('assets/images/backgrounds/donwload-bg.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroudColor: "#F00",
        textAlign: "center"
    },
    button: {
        // margin: theme.spacing.unit,
        // marginTop: theme.spacing.unit,
        // marginBottom: theme.spacing.unit,
        textTransform: 'none',
        border: 'solid 1px #b7bbbe',
        background: '#fefefe',
        color: '#686868',
        fontWeight: 'bolder',
        boxShadow: 'none',
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit
    },
    fabButton: {
        textTransform: 'none',
        border: 'solid 1px #b7bbbe',
        background: '#fefefe',
        color: '#686868',
        fontWeight: 'bolder',
        boxShadow: 'none',
        margin: theme.spacing.unit / 2,
        // paddingLeft: theme.spacing.unit * 5,
        // paddingRight: theme.spacing.unit * 5,
        [theme.breakpoints.up('lg')]: {
            margin: theme.spacing.unit
        }
    },
    linkButton: {
        textTransform: 'none',
        color: '#686868',
        fontWeight: 'bolder',
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit
    },
    iconInButton: {
        marginRight: theme.spacing.unit,
        fontSize: 20
    },
    highlightText: {
        color: theme.palette.primary.color+" !important",
        fontWeight: 'bolder'
    },
    highlightButton: {
        background: theme.palette.primary.color,
        color: '#ffffff'
    },
    dangerButton: {
        background: '#ff0000',
        color: '#ffffff'
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: '100%'
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    },
    tooltipDotBadge: {
        width: 16,
        alignItems: 'flex-end',
        color: '#777777',
        marginLeft: 8
    },
    tooltip: {
        fontSize: '14px',
        fontFamily: 'inherit'
    },
    dialog: {
        fontFamily: "inherit",
        fontWeight: 300,
        lineHeight: 1.8
    },
    longTextArea: {
        wordBreak: 'keep-all'
    },
    productTableWrapper: {
        width: '100%',
        height: 300,
        border: 'none',
        boxShadow: 'none',
        marginTop: 5
    },
    existingProductTableWrapper: {
        width: '100%',
        height: '100%',
        // height: 500,
        border: 'none',
        boxShadow: 'none',
        marginTop: 5,
        [theme.breakpoints.up('lg')]: {
            height: 500
        }
    },
    headerCloseBtn: {
        cursor: 'pointer',
        fontSize: 'large',
        fontWeight: 'bolder'
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    extendedMargin: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    },
    /* For Product Info Form Prompt */
    topic: {
        fontWeight: 'bolder',
        fontSize: '1.5rem',
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
    mainBadge: {
        top: '50%',
        right: '90%',
        background: '#dd3e8e'
    },
    closeUpBadge: {
        top: '50%',
        right: '90%',
        background: '#fba75f'
    },
    addImageHelpText: {
        color: '#a0acb8',
        fontSize: '.85rem',
        fontWeight: 600
    },
    mainProductImageTitle: {
        color: theme.palette.primary.color,
        fontWeight: 600
    },
    uploadMainProductImageText: {
        color: '#606060',
        fontSize: '1rem',
        fontWeight: 'bold'
    },
    mainAddProductImage: {
        padding: theme.spacing.unit * 2,
        display: 'flex',
        borderColor: '#a0acb8',
        justifyContent: 'center'
    },
    mainAddProductImageIcon: {
        fontSize: 40,
        color: '#a0acb8',
        display: 'flex',
        clear: 'both'
    },
    closeupProductImageTitle: {
        color: "#faa85e",
        fontWeight: 600
    },
    uploadCloseupProductImageText: {
        color: '#606060',
        fontSize: '.65rem',
        fontWeight: 'bold'
    },
    closeUpProductImageArea: {
        flexBasis: 'auto',
        display: 'flex',
        width: '31%',
        maxWidth: '31%',
        minWidth: 'auto'
    },
    closeUpAddProductImage: {
        flexBasis: 'auto',
        display: 'inline-flex',
        borderColor: '#a0acb8',
        justifyContent: 'center',
        width: '90%',
        maxWidth: '90%',
        minWidth: 'auto'
    },
    closeUpAddProductImageIcon: {
        fontSize: 25,
        color: '#a0acb8',
        display: 'flex',
        clear: 'both'
    },
    productVariationHeaderRow: {
        paddingBottom: theme.spacing.unit,
        fontWeight: 'bold',
        borderBottom: '1px solid #777777',
        display: 'flex',
    },
    productVariationContentRow: {
        paddingBottom: theme.spacing.unit,
        paddingTop: theme.spacing.unit,
        display: 'flex',
        alignItems: 'start'
    },
    productVariationInputCell: {
        paddingBottom: theme.spacing.unit / 2,
        paddingTop: theme.spacing.unit / 2,
    },
    customRoot: {
        'label + &': {
            marginTop: theme.spacing.unit * 3,
        },
    },
    customInput: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.common.white,
        border: '1px solid #ced4da',
        fontSize: 16,
        width: 100,
        padding: '5px 6px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        }
    },
    customCheckboxRoot: {
        padding: 7
    },
    highlightCardBackground: {
        background: "linear-gradient(233.76deg, #F2598B -4.27%, #FB8785 88.75%)"
    },
    upgradePackagesBtn: {
        background: '#FFFFFF',
        boxShadow: '0.871795px 1.74359px 3.48718px rgba(0, 0, 0, 0.25)',
        borderRadius: '25.2821px',
        color: "#F2598B"
    }
    /* End Product Info Form Prompt */
    
});

export default styles;
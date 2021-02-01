export const CHANGE_TAB = "[MAIN CONTENT] CHANGE_TAB";

export function changeTab(tabValue) {
    return {
        type: CHANGE_TAB,
        payload: {
            tabValue: tabValue,
        },
    };
}

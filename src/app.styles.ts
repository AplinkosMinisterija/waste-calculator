import {StyleSheet} from "@react-pdf/renderer";

export const styles = StyleSheet.create({
    page: {
        fontFamily: "Roboto",
        padding: "0 12px"
    },
    table: {
        width: "100%",
        borderWidth: 2,
        display: "flex",
        flexDirection: "column"
    },
    tableRow: {
        display: "flex",
        flexDirection: "row"
    },
    nameRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: "12px"
    },
    itemRow: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flexDirection: "row"
    },
    cell: {
        borderWidth: 1,
        flex: "1",
        fontSize: "10px",
        padding: "4px"
    },
    totalCell: {
        fontSize: "10px",
        padding: "4px"
    },
    title: {
        fontSize: "10px",
        fontWeight: "bold",
        margin: "12px 0 4px 0px"
    },
    mainTitle: {
        fontSize: "14px",
        fontWeight: "bold",
        textAlign: "center"
    },
    date: {
        fontSize: "12px",
        fontWeight: "bold",
        textAlign: "center"
    },
    selectedDate: {
        fontSize: "12px",
        textAlign: "left"
    },
    label: {
        fontSize: "12px"
    },
    signature: {
        fontSize: "12px",
        marginRight: "100px"
    },
    name: {
        fontSize: "12px"
    }
});
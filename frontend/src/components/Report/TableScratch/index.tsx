import React from 'react';
import { View, StyleSheet, Text } from "@react-pdf/renderer";
import { StencilRobotMedition, StencilTensionValues } from '@/types/models';
import { formatDateTime, formatDateTimeToHour } from '@/functions/functions';

interface Props {
    arranhoesList: StencilRobotMedition [] | undefined;
}

const TableScratch: React.FC<Props> = ({ arranhoesList }) => {

    const styles = StyleSheet.create({
        container: {
            display: "flex",
            flexDirection: "column",
            width: "95%",
            borderRadius: 10,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
        },
        header: {
            flexDirection: "row",
            width: "100%",
            backgroundColor: "rgb(105, 165, 215)",
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            padding: 5,
            borderTopWidth: 0.1,
            borderRightWidth: 0.1,
            borderLeftWidth: 0.1,
            borderColor: "black",
            alignItems: "center"
        },
        textHeader: {
            color: "white",
            fontSize: 13,
            fontWeight: "bold",
            flex: 1,
            textAlign: "center",
        },
        body: {
            width: "100%",
            display: "flex",
            flexDirection: "column",
            borderBottomWidth: 0.1,
            borderRightWidth: 0.1,
            borderLeftWidth: 0.1,
            borderColor: "black",
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
        },
        itemTable: {
            flexDirection: "row",
            width: "100%",
            padding: 5,
            justifyContent: "space-around",
            alignItems: "center",
        },
        textItem: {
            color: "black",
            fontSize: 13,
            flex: 1,
            textAlign: "center",
        },
    });

    const arrayTitles: string[] = ["Data","Hora","Arranhões"];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {arrayTitles.map((title, index) => (
                    <Text key={index} style={styles.textHeader}>{title}</Text>
                ))}
            </View>
            <View style={styles.body}>
                {arranhoesList && (arranhoesList.map((value, index) => (
                    <View
                        style={{
                            ...styles.itemTable,
                            borderBottomWidth: index === arranhoesList.length - 1 ? 0.1 : 0.2,
                            borderRadius: index === arranhoesList.length - 1 ? 10 : 0
                        }}
                        key={index}
                    >
                        <Text style={styles.textItem}>
                            {value.timestamp ? formatDateTime(value.timestamp) : "Não informado."}
                        </Text>

                        <Text style={styles.textItem}>
                            {value.timestamp ? formatDateTimeToHour(value.timestamp) : "Não informado."}
                        </Text>
                        
                        <Text style={styles.textItem}>{value.scratch_count}</Text>
                        
                    </View>
                )))}
            </View>
        </View>
    );
};

export default TableScratch;

import React from 'react';
import { View, StyleSheet, Text } from "@react-pdf/renderer";
import { StencilTensionValues } from '@/types/models';
import { formatDateTime } from '@/functions/functions';

interface Props {
    tensionValues: StencilTensionValues[] | undefined;
}

const Table: React.FC<Props> = ({ tensionValues }) => {

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

    const arrayTitles: string[] = ["Date", "Status", "P1", "P2", "P3", "P4", "Cicles"];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {arrayTitles.map((title, index) => (
                    <Text key={index} style={styles.textHeader}>{title}</Text>
                ))}
            </View>
            <View style={styles.body}>
                {tensionValues && (tensionValues.map((value, index) => (
                    <View
                        style={{
                            ...styles.itemTable,
                            borderBottomWidth: index === tensionValues.length - 1 ? 0.1 : 0.2,
                            borderRadius: index === tensionValues.length - 1 ? 10 : 0
                        }}
                        key={index}
                    >
                        <Text style={styles.textItem}>
                            {value.measurement_datetime ? formatDateTime(value.measurement_datetime) : "Não informado."}
                        </Text>
                        <Text style={styles.textItem}>
                            {value.is_approved_status !== undefined ?
                                (value.is_approved_status ? "Aprovado" : "Reprovado")
                                : "Não informado."}
                        </Text>
                        <Text style={styles.textItem}>{value.p1}</Text>
                        <Text style={styles.textItem}>{value.p2}</Text>
                        <Text style={styles.textItem}>{value.p3}</Text>
                        <Text style={styles.textItem}>{value.p4}</Text>
                        <Text style={styles.textItem}>{value.cicles}</Text>
                    </View>
                )))}
            </View>
        </View>
    );
};

export default Table;

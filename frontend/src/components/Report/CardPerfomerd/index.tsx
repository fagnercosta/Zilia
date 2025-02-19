
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';


interface Props {
    textHeader: string
    children: React.ReactNode
}

const CardPerformed = ({
    textHeader,
    children
}: Props) => {

    const styles = StyleSheet.create({
        container: {
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            flexDirection: "column",
            width: "90%",
            borderRadius: 10,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
        },
        header: {
            backgroundColor: "rgb(105, 165, 215)",
            width: "100%",
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            padding: 5,
            borderTopWidth: 0.1,
            borderRightWidth: 0.1,
            borderLeftWidth: 0.1,
            borderColor: "black",
            justifyContent: "space-between",
            flexDirection: "row"
        },
        textHeader: {
            color: "white",
            fontSize: 13,
            fontWeight: "bold"
        },
        body: {
            width: "100%",
            minHeight: 10,
            padding: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "row",
            borderBottomWidth: 0.1,
            borderRightWidth: 0.1,
            borderLeftWidth: 0.1,
            borderColor: "black",
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
        },
    })

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.textHeader}>{textHeader}</Text>
                <Text style={styles.textHeader}>12/02/2024</Text>
            </View>
            <View style={styles.body}>
                {children}
            </View>
        </View>
    )
}

export default CardPerformed
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

interface Props {
    textHeader: string,
    attribute: string | number | boolean 
}

const CardInfos = ({
    textHeader,
    attribute
}: Props) => {

    const styles = StyleSheet.create({
        container: {
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            flexDirection: "column",
            borderRadius: 10,
            width: 150,
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
            borderColor: "black"
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
        textBody: {
            color: "Black",
            fontSize: 12,
            fontWeight: "bold"
        }
    })

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.textHeader}>{textHeader}</Text>
            </View>
            <View style={styles.body}>
                <Text style={styles.textBody}>{attribute}</Text>
            </View>
        </View>
    )
}

export default CardInfos
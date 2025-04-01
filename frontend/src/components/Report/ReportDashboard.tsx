import React, { useEffect } from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { formatDateTime, getRGB, getRGBScrath, getSmallestPoint } from '../../functions/functions';
import A1 from "../../assets/usado/A1.jpg"
import A2 from "../../assets/usado/A2.jpg"
import A3 from "../../assets/usado/A3.jpg"
import A4 from "../../assets/usado/A4.jpg"
import A5 from "../../assets/usado/A5.jpg"
import A6 from "../../assets/usado/A6.jpg"
import A7 from "../../assets/usado/A7.jpg"
import A8 from "../../assets/usado/A8.jpg"
import A9 from "../../assets/usado/A9.jpg"
import CardInfos from './CardInfos';
import CardPerformed from './CardPerfomerd';
import CircleColorPointer from './CircleColorPointer';
import Table from './Table';
import { Stencil, StencilRobotMedition, StencilTensionValues } from '@/types/models';
import Logo from "../../assets/logo.png"
import StencilImage from "../../assets/Stencil.jpeg"
import TableScratch from './TableScratch';

interface Props {
    stencil: Stencil,
    tensionValues: StencilTensionValues[] | undefined,
    arranhoesList: StencilRobotMedition[] |undefined,
    lastRobotMedition: StencilRobotMedition | undefined,
}

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: 'white',

    },
    header: {
        width: "100%",
        flexDirection: "row",
        display: "flex",
        padding: 10,
        justifyContent: "flex-start",
        alignItems: "center"
    },
    divImage: {
        width: 80,
    },
    tittleReport: {
        marginLeft: 130,
        color: "black",
        fontSize: 18
    }
});

const stylesBody = StyleSheet.create({
    containerItemsInfo: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        flexDirection: "row",
        marginTop: 15,
        marginBottom: 15
    },
    titleBody: {
        margin: 10,
        color: "black",
        fontSize: 16
    },
    containerStencilInfo: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        marginTop: 15,
        marginBottom: 15,
    }
})

const stylesLastMedition = StyleSheet.create({
    container: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start"
    },
    viewImage: {
        width: "50%",
        minHeight: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
    },
    containerInfos: {
        width: "50%",
        marginLeft: 10,
        minHeight: 50,
    },
    containerTexts: {
        width: "50%",
        height: 120,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-start",
        flexDirection: "column",
        gap: 5
    },
    text: {
        color: "black",
        fontSize: 12,
        fontWeight: "bold"
    },
    circle: {
        width: 50,
        height: 30,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // borderRadius: 10,
        position: 'absolute',
    },
    topLeft: {
        top: 38,
        left: 57,
    },
    topRight: {
        top: 38,
        right: 57,
    },
    bottomLeft: {
        bottom: 50,
        left: 57,
    },
    bottomRight: {
        bottom: 52,
        right: 57,
    },
    viewTexts: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        justifyContent: "space-between",
        width: 120,
    }
})

const stylesListTensionPoints = StyleSheet.create({
    container: {
        display: "flex",
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 10
    }
})

const stylesSignature = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "column",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        gap: 3,
        marginTop: 55
    },
    fieldSignature: {
        width: "40%",
        height: 1,
        backgroundColor: "black",
        borderRadius: 10
    },
    textSignature: {
        color: "black",
        fontSize: 14,
        fontWeight: "bold"
    }

})

const stylesCountScratchs = StyleSheet.create({
    container: {
        width: "100%",
        height: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    containerImages: {
        width: "80%",
        height: 360,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    viewImage: {
        width: "33.3%",
        height: 119,
        display: "flex",
        position: "relative"
    },
    image: {
        objectFit: "cover",
        width: "100%",
        height: 119
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 99,
        position: 'absolute',
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        padding: 5
    },
    text: {
        color: "black",
        fontSize: 12,
        fontWeight: "bold"
    },
    center: {
        top: "40%",
        left: "40%"
    },
    row: {
        display: "flex",
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start"
    }
})

const StencilReport = ({
    stencil,
    tensionValues,
    lastRobotMedition,
    arranhoesList

}: Props) => {
    // const StencilReport = () => {
    const urlsGraphs: any[] = []


    return (

        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View style={styles.divImage}>
                        <Image
                            source={Logo.src}
                            style={{ objectFit: "cover" }}

                        />
                    </View>
                    <Text style={styles.tittleReport}>Relatório de Conformidade</Text>
                </View>
                <View style={stylesBody.containerItemsInfo}>
                    <CardInfos
                        textHeader='Identification'
                        attribute={stencil.stencil_part_nbr}
                    />
                    <CardInfos
                        textHeader="Status"
                        attribute={stencil.status}
                    />
                    <CardInfos
                        textHeader="Manufacturing"
                        attribute={formatDateTime(stencil.mfg_date) ?? "N/A"}
                    />
                </View>
                <View style={stylesBody.containerItemsInfo}>
                    <CardInfos
                        textHeader='Tickness'
                        attribute={`${stencil.thickness} mm`}
                    />
                    <CardInfos
                        textHeader='Destination'
                        attribute={stencil.stencil_destination}
                    />
                    <CardInfos
                        textHeader='Location'
                        attribute={stencil.location}
                    />
                </View>
                <View style={stylesBody.containerStencilInfo}>
                    <CardPerformed textHeader='Last Medition '  dataTime={tensionValues && tensionValues.length > 0 ? String(tensionValues[0]?.measurement_datetime ? formatDateTime(tensionValues[0]?.measurement_datetime) : "") : ""}>
                        <View style={stylesLastMedition.container}>
                            <View style={stylesLastMedition.viewImage}>
                                <Image
                                    source={StencilImage.src}
                                    style={{
                                        width: "100%",
                                        height: 250,
                                        objectFit: "cover"
                                    }}
                                />
                                
                                <View style={[stylesLastMedition.circle, stylesLastMedition.bottomRight, { backgroundColor: getRGB(stencil.p3_value) }]} >
                                <Text style={{
                                        fontSize: 12,

                                    }}>
                                        P3: {stencil.p3_value}
                                    </Text>
                                </View>
                                <View style={[stylesLastMedition.circle, stylesLastMedition.topRight, { backgroundColor: getRGB(stencil.p4_value) }]}>
                                    <Text style={{
                                        fontSize: 12,

                                    }}>
                                        P4: {stencil.p4_value}
                                    </Text>

                                </View>
                               
                                <View style={[stylesLastMedition.circle, stylesLastMedition.topLeft, { backgroundColor: getRGB(stencil.p2_value) }]} >
                                <Text style={{
                                        fontSize: 12,

                                    }}>
                                        P2: {stencil.p2_value}
                                    </Text>
                                </View>

                                <View style={[stylesLastMedition.circle, stylesLastMedition.bottomLeft, { backgroundColor: getRGB(stencil.p1_value) }]} >
                                <Text style={{
                                        fontSize: 12,

                                    }}>
                                        P1: {stencil.p1_value}
                                    </Text>
                                </View>
                                
                            </View>
                            <View style={stylesLastMedition.containerInfos}>
                                <View style={stylesLastMedition.containerTexts}>
                                    <View style={stylesLastMedition.viewTexts} >
                                        <Text style={stylesLastMedition.text}>
                                            P1: {stencil.p1_value} N/cm2
                                        </Text>
                                        <CircleColorPointer
                                            valuePoint={stencil.p1_value}
                                        />
                                    </View>
                                    <View style={stylesLastMedition.viewTexts}>
                                        <Text style={stylesLastMedition.text}>
                                            P2: {stencil.p2_value} N/cm2
                                        </Text>
                                        <CircleColorPointer
                                            valuePoint={stencil.p2_value}
                                        />
                                    </View>
                                    <View style={stylesLastMedition.viewTexts}>
                                        <Text style={stylesLastMedition.text}>
                                            P3: {stencil.p3_value} N/cm2
                                        </Text>
                                        <CircleColorPointer
                                            valuePoint={stencil.p3_value}
                                        />
                                    </View>
                                    <View style={stylesLastMedition.viewTexts}>
                                        <Text style={stylesLastMedition.text}>
                                            P4: {stencil.p4_value} N/cm2
                                        </Text>
                                        <CircleColorPointer
                                            valuePoint={stencil.p4_value}
                                        />
                                    </View>
                                    <View style={{
                                        flexDirection: "row",
                                        gap: 10,
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        width: 210,
                                        marginTop: 20
                                    }}
                                    >
                                        <Text style={stylesLastMedition.text}>
                                            {getSmallestPoint(stencil.p1_value, stencil.p2_value, stencil.p3_value, stencil.p4_value)?.message}
                                        </Text>
                                        <CircleColorPointer
                                            valuePoint={stencil.p1_value > 0 ? getSmallestPoint(stencil.p1_value, stencil.p2_value, stencil.p3_value, stencil.p4_value)?.point : 0}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </CardPerformed>
                </View>
                <Text style={{ ...styles.tittleReport, marginLeft: 20, marginTop: 30 }}>Medidas dos Valores de tensão</Text>
                <View style={stylesListTensionPoints.container}>
                    <Table
                        tensionValues={tensionValues}
                    />
                </View>

                <Text style={{ ...styles.tittleReport, marginLeft: 20, marginTop: 30 }}>Medidas de Arranhões</Text>

                <View style={stylesListTensionPoints.container}>
                    < TableScratch
                        arranhoesList={arranhoesList}
                    />
                </View>
                <View style={stylesBody.containerStencilInfo}>
                    <CardPerformed textHeader='Última Medição de Arranhão' dataTime={String(lastRobotMedition?.timestamp ? formatDateTime(lastRobotMedition.timestamp) : "")} >
                        <View style={stylesCountScratchs.container}>
                            <View style={stylesCountScratchs.containerImages}>
                                {
                                    lastRobotMedition ?
                                        <View style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "100%",
                                            position: "relative"
                                        }}>
                                            <Image
                                                src={`http://localhost:8000/${lastRobotMedition.image_path}`}
                                                style={{
                                                    width: "100%",
                                                    height: 250,
                                                    objectFit: "cover"
                                                }}
                                            />
                                            <Text style={{
                                                top: 0,
                                                left: 0,
                                                fontSize: 36,
                                                color: "#58f11f",
                                                position: "absolute"
                                            }}>
                                                {lastRobotMedition.scratch_count}
                                            </Text>
                                        </View>
                                        :
                                        <View style={{
                                            width: "100%",
                                            height: 250,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}>

                                            <Text>Não há medições de arranhões para este Stencil.</Text>
                                        </View>
                                }
                            </View>
                        </View>
                    </CardPerformed>
                </View>
                <View style={stylesSignature.container}>
                    <View style={stylesSignature.fieldSignature}></View>
                    <Text style={stylesSignature.textSignature}>Assinatura</Text>
                </View>
            </Page>
            <Page size="A4" style={styles.page}>




            </Page>
        </Document>
    )

};

export default StencilReport;

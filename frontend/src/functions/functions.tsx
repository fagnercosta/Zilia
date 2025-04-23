import { Stencil } from "@/types/models"

export function formatDateTime(date: string) {

    console.log("HORA"+date)
    try {
        const year = date.substring(0, 4)
        const mounth = date.substring(5, 7)
        const day = date.substring(8, 10)

        return `${day}/${mounth}/${year}`
    } catch (error) {
        
    }
}

export function formatDateTimeToHour(date: string) {
    console.log("HORA"+date)
    try {
        const hora = date.substring(11,13)
        const minutos = date.substring(14, 16)
        

        return `${hora}:${minutos}`
    } catch (error) {
        
    }
}

export function getRGBFromDate(targetDate: Date) {
    const currentDate = new Date();
    
    // Define um intervalo de dias, por exemplo, 30 dias.
    const maxDays = 30;

    // Calcula a diferença em milissegundos e converte para dias.
    const diffInTime = targetDate.getTime() - currentDate.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);

    // Se a data estiver fora do intervalo, retorne undefined.
    if (diffInDays < 0 || diffInDays > maxDays) {
        return;
    }

    // Se a data estiver hoje, retornamos vermelho completo.
    if (diffInDays === 0) {
        return `rgb(255,0,0)`;
    }

    // Normaliza o valor entre 0 e 1 com base nos dias restantes.
    const normalizedValue = diffInDays / maxDays;

    // Quanto mais próximo de hoje, mais vermelho. Quanto mais distante, mais verde.
    const red = Math.round(255 * (1 - normalizedValue));
    const green = Math.round(255 * normalizedValue);

    return `rgb(${red},${green},0)`;
}

export function getRGB(value: number) {
    //if (value < 30 || value > 40) {
       // return
  //  }
    if (value === 35) {
        return `rgb(255,255,0)`;
    }
    if (value < 35) {
        const normalizedValue = (value - 30) / 5;
        const green = Math.round(255 * normalizedValue);
        return `rgb(255,${green},0)`;
    }
    if (value > 35) {
        const normalizedValue = (value - 35) / 5;
        const red = Math.round(255 * (1 - normalizedValue));
        return `rgb(${red},255,0)`;
    }
}

export function getRGBScrath(value: number) {
    if (value < 0 || value > 400) {
        return;
    }

    if (value === 200) {
        return `rgb(255,255,0)`;
    }

    if (value < 200) {
        const normalizedValue = value / 200;
        const red = Math.round(255 * normalizedValue);
        const green = 255;
        return `rgb(${red},${green},0)`;
    }

    if (value > 200) {
        const normalizedValue = (value - 200) / 200;
        const red = 255;
        const green = Math.round(255 * (1 - normalizedValue));
        return `rgb(${red},${green},0)`;
    }
}


export function getSmallestPoint(
    p1: number,
    p2: number,
    p3: number,
    p4: number,
) {
    if (p1 < p2 && p1 < p3 && p1 < p4) {
        return {
            message: `P1 is the worst case: ${p1} N/cm2`,
            point: p1
        }
    } else if (p2 < p1 && p2 < p3 && p2 < p4) {
        return {
            message: `P2 is the worst case: ${p2} N/cm2`,
            point: p2
        }
    } else if (p3 < p1 && p3 < p2 && p3 < p4) {
        return {
            message: `P3 is the worst case: ${p3} N/cm2`,
            point: p3
        }
    } else if (p4 < p1 && p4 < p2 && p4 < p3) {
        return {
            message: `P1 is the worst case: ${p4} N/cm2`,
            point: p4
        }
    }
}

export function arraysAreEqual(arr1: Stencil[], arr2: Stencil[]): boolean {

    // Verifica se os arrays possuem o mesmo comprimento
    if (arr1.length !== arr2.length) {
        return false;
    }

    // Copia e ordena os arrays para comparação
    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();

    // Compara os itens dos arrays ordenados
    for (let i = 0; i < sortedArr1.length; i++) {
        if (sortedArr1[i] !== sortedArr2[i]) {
            return false;
        }
    }

    return true;
}

export function difference(arr1: Stencil[], arr2: Stencil[]): Stencil[] {


    const set1 = new Set(arr1.map(item => item.stencil_id));
    // Filtra o segundo array para retornar apenas os itens que não estão no conjunto criado
    return arr2.filter(item => !set1.has(item.stencil_id));
}

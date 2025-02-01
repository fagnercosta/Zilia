export interface Stencil {
    stencil_id: number;
    site_id: string;
    stencil_part_nbr: string;
    vendor_part_nbr: string;
    vendor: string;
    mfg_date: string;  // ISO 8601 string format for dates
    product_type: string;
    thickness: string;
    pcb_up_nbr: number;
    location: string;
    status: string;
    life_limit: number;
    counter: number;
    trigger_err_limit: number;
    reg_date_time: string | null;  // ISO 8601 string format for date-time
    reg_user_id: string;
    notes: string;
    update_user_id?: string | null;  // Optional field
    datetime: string | null;  // ISO 8601 string format for date-time
    revision: string;
    side: string;
    label_info: string;
    is_active_in_use: boolean;
    stencil_destination: string;
    p1_value: number;
    p2_value: number;
    p3_value: number;
    p4_value: number;
    is_blocked_stencil: boolean;
    index_of_suggested_stencil: number;
    object_status: string;
}

export interface UsersTipe{
    first_name: string;
    email: string;

}


export interface StencilTensionValues {
    url: string;
    p1: number;
    p2: number;
    p3: number;
    p4: number;
    start_of_specific_range: number;
    end_of_specific_range: number;
    measurement_datetime: string;
    description: string;
    is_registration_measurement: boolean;
    is_approved_status: boolean;
    cicles: number;
    stencil_id: number;
}

export interface StencilRobotMedition{
    id: number
    image_path: string
    scratch_count: number
    stncil: number
    timestamp: string
}
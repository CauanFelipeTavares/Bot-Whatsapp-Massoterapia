export interface MessageParams {
    id: {
        remote: string
    }
    body: string
    _data: {
        notifyName?: string
    }
}

export interface Customer {
    name?: string
    id: string
    step: number
    optionsMsgId?: string
}

export interface StepParams {
    file: string
}
type SetValueOptions = {
    separator?: string;
};
export declare function setValueAtPath(object: any, key: string, value: any, options?: SetValueOptions): {
    object: any;
    key: string;
    value: any;
    currentObject: any;
};
export declare function getValueAtPath(object: any, key: string, options?: SetValueOptions): {
    object: any;
    key: string;
    value: any;
    currentObject: any;
};
export declare function deleteValueAtPath(object: any, key: string, options?: SetValueOptions): {
    object: any;
    key: string;
    value: any;
    currentObject: any;
};
export {};

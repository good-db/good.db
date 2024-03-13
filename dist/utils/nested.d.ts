type SetValueOptions = {
    separator?: string;
};
export declare function setValueAtPath(object: any, key: string, value: any, options?: SetValueOptions): any;
export declare function getValueAtPath(object: any, key: string, options?: SetValueOptions): any;
export declare function deleteValueAtPath(object: any, key: string, options?: SetValueOptions): any;
export {};

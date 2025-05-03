export type ICallbackParams<T = any> = (response: {
	success: boolean;
	data: T;
}) => void;

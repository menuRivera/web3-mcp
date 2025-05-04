export interface ICallbackParams<T = any> {
	success: boolean,
	data: T,
	error?: string
}

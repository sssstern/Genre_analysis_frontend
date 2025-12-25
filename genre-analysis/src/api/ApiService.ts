import api from './index'; 
import { Api, HttpClient } from './Api'; 
import { AxiosInstance } from 'axios'; 


const baseHttpClient = new HttpClient({
    instance: api as AxiosInstance, 
    baseURL: '/api', 
} as any); 


const generatedClient = new Api(baseHttpClient as any);


export const UserService = generatedClient.user;
export const GenreService = (generatedClient as any).genre;
export const AnalysisRequestService = (generatedClient as any).analysisRequest;

export * from './Api';
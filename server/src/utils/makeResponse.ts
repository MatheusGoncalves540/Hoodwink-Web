import { throwError } from "rxjs";

type ResponseStatus = 'success' | 'error' | 'warning' | 'info';

export interface ResponseData {
  status: ResponseStatus;
  message: string;
  data?: any;
}

export function make_response(status: ResponseStatus, message: string, data?: any): ResponseData {
  return {
    status,
    message,
    data,
  };
}

// Exemplo de uso
// const successResponse = make_response('success', 'Operação concluída com sucesso');
// const errorResponse = make_response('error', 'Ocorreu um erro ao processar a solicitação', { errorCode: 500 });

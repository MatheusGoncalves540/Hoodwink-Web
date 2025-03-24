import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

/**
 * @param res - Objeto de resposta HTTP (Express), utilizado para enviar a resposta.
 * @param status - Código de status HTTP (HttpStatus) a ser retornado (padrão: 200 OK).
 * @param message - Mensagem personalizada para a resposta. (padrão: 'Operation successful' para sucesso e 'An error occurred' para erro).
 * @param data - Dados adicionais a serem retornados na resposta (padrão: null).
 * @param error - Indica se a resposta é de erro (padrão: false, indicando sucesso).
 * @param customHeaders - Cabeçalhos personalizados a serem adicionados à resposta (padrão: vazio).
 *
 * @returns Retorna a resposta HTTP com os dados apropriados no formato JSON.
 *
 * Exemplo de uso para sucesso:
 * makeResponse(res, HttpStatus.OK, 'Request was successful', { some: 'data' });
 *
 * Exemplo de uso para erro:
 * makeResponse(res, HttpStatus.BAD_REQUEST, 'Invalid input', null, true);
 */
export function makeResponse(
  res: Response,
  status: number = HttpStatus.OK, // Código de status padrão é 200
  message: string = '', // Mensagem personalizada
  data: any = null, // Dados opcionais a serem retornados
  error: boolean = false, // Indica se é uma resposta de erro
  customHeaders: Record<string, string> = {}, // Cabeçalhos personalizados
) {
  Object.keys(customHeaders).forEach(key => {
    res.setHeader(key, customHeaders[key]);
  });

  if (error) {
    return res.status(status).json({
      status: 'error',
      message: message || 'An error occurred :(',
      ...(data && { data }),
    });
  }

  return res.status(status).json({
    status: 'success',
    message: message || 'Operation successful :)',
    ...(data && { data }),
  });
}

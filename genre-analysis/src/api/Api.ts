/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum DsUserRole {
  RoleGuest = "guest",
  /** Обычный пользователь */
  RoleCreator = "creator",
  RoleModerator = "moderator",
}

export interface DsAnalysisGenreDTO {
  CommentToRequest?: string;
  GenreID?: number;
  GenreImageURL?: string;
  GenreName?: string;
  ProbabilityPercent?: number;
}

export interface DsAnalysisRequestDTO {
  AnalysisRequestID?: number;
  AnalysisRequestStatus?: string;
  CompletedAt?: string;
  CreatedAt?: string;
  CreatorLogin?: string;
  FormedAt?: string;
  Genres?: DsAnalysisGenreDTO[];
  ModeratorLogin?: string;
  TextToAnalyse?: string;
}

export interface DsAuthResponseDTO {
  access_token?: string;
  /** Unix timestamp истечения */
  expires_in?: number;
  token_type?: string;
}

export interface DsChangeUserDTO {
  login?: string;
  password?: string;
}

export interface DsGenreDTO {
  GenreID?: number;
  GenreImageURL?: string;
  GenreKeywords?: string;
  GenreName?: string;
}

export interface DsUpdateAnalysisRequestDTO {
  TextToAnalyse?: string;
}

export interface DsUpdateGenreDTO {
  GenreKeywords?: string;
  GenreName?: string;
}

export interface DsUpdateGenreRequestDTO {
  comment_to_request?: string;
  probability_percent?: number;
}

export interface DsUserDTO {
  Login?: string;
  /** Теперь строковое поле */
  Role?: DsUserRole;
  UserID?: number;
}

export interface HandlerErrorResponse {
  message?: string;
}

export interface AnalysisGenresUpdateParams {
  /** ID жанра */
  id: number;
}

export interface AnalysisGenresDeleteParams {
  /** ID жанра для удаления */
  id: number;
}

export interface GenresListParams {
  /** Поиск по названию жанра (частичное совпадение) */
  searchbygenrename?: string;
}

export interface AddToAnalysisCreateParams {
  /** ID жанра для добавления */
  id: number;
}

export interface GenresDetailParams {
  /** ID жанра */
  id: number;
}

export interface GenresUpdateParams {
  /** ID жанра */
  id: number;
}

export interface GenresDeleteParams {
  /** ID жанра */
  id: number;
}

export interface ImageCreatePayload {
  /** Файл изображения */
  file: File;
}

export interface ImageCreateParams {
  /** ID жанра */
  id: number;
}

export interface TextAnalysisRequestListParams {
  /** Фильтр по статусу ('черновик', 'сформирован', 'завершён', 'отклонён') */
  status?: string;
}

export interface TextAnalysisRequestDetailParams {
  /** ID заявки */
  id: number;
}

export interface TextAnalysisRequestsUpdateParams {
  /** ID заявки (черновика) */
  id: number;
}

export interface TextAnalysisRequestsDeleteParams {
  /** ID заявки (черновика) */
  id: number;
}

export interface FormUpdateParams {
  /** ID заявки (черновика) */
  id: number;
}

export interface ProcessUpdateParams {
  /** Действие ('complete' или 'reject') */
  action: string;
  /** ID заявки */
  id: number;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "http://localhost:8082/api/v1",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance
      .request({
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type ? { "Content-Type": type } : {}),
        },
        params: query,
        responseType: responseFormat,
        data: body,
        url: path,
      })
      .then((response) => response.data);
  };
}

/**
 * @title Анализ Принадлежности Текста к Жанру
 * @version 1.0
 * @baseUrl http://localhost:8082/api/v1
 * @contact
 *
 * Используется для запросов из браузера.
 */
export class Api<SecurityDataType extends unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  analysisGenres = {
    /**
     * @description Обновляет комментарий и процент вероятности для жанра в текущем черновике заявки.
     *
     * @tags Домен м-м
     * @name AnalysisGenresUpdate
     * @summary Обновить жанр в заявке
     * @request PUT:/analysis-genres/{id}
     * @secure
     * @response `204` `void` Успешное обновление
     * @response `400` `HandlerErrorResponse` Неверный формат ID или данных
     * @response `401` `HandlerErrorResponse` Неавторизован
     * @response `500` `HandlerErrorResponse` Ошибка сервера
     */
    analysisGenresUpdate: (
      { id, ...query }: AnalysisGenresUpdateParams,
      request: DsUpdateGenreRequestDTO,
      params: RequestParams = {},
    ) =>
      this.http.request<void, HandlerErrorResponse>({
        path: `/analysis-genres/${id}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Удаляет жанр из текущего черновика заявки.
     *
     * @tags Домен м-м
     * @name AnalysisGenresDelete
     * @summary Удалить жанр из заявки
     * @request DELETE:/analysis-genres/{id}
     * @response `204` `void` Успешное удаление
     * @response `400` `HandlerErrorResponse` Неверный формат ID
     * @response `401` `HandlerErrorResponse` Неавторизован
     * @response `500` `HandlerErrorResponse` Ошибка сервера
     */
    analysisGenresDelete: (
      { id, ...query }: AnalysisGenresDeleteParams,
      params: RequestParams = {},
    ) =>
      this.http.request<void, HandlerErrorResponse>({
        path: `/analysis-genres/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
  genres = {
    /**
     * @description Возвращает список всех существующих жанров. Доступен публично.
     *
     * @tags Домен жанров
     * @name GenresList
     * @summary Получить список жанров
     * @request GET:/genres
     * @response `200` `DsGenreDTO` Список жанров
     * @response `500` `HandlerErrorResponse` Ошибка сервера
     */
    genresList: (query: GenresListParams, params: RequestParams = {}) =>
      this.http.request<DsGenreDTO, HandlerErrorResponse>({
        path: `/genres`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Создает новый жанр. Требуются права **Модератора**.
     *
     * @tags Домен жанров
     * @name GenresCreate
     * @summary Создать новый жанр
     * @request POST:/genres
     * @secure
     * @response `201` `DsGenreDTO` Успешное создание жанра
     * @response `400` `HandlerErrorResponse` Неверный формат данных
     * @response `403` `HandlerErrorResponse` Доступ запрещен (не модератор)
     * @response `500` `HandlerErrorResponse` Ошибка сервера
     */
    genresCreate: (request: DsUpdateGenreDTO, params: RequestParams = {}) =>
      this.http.request<DsGenreDTO, HandlerErrorResponse>({
        path: `/genres`,
        method: "POST",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавляет жанр в текущую черновую заявку пользователя. Требуется **Авторизация**.
     *
     * @tags Домен жанров
     * @name AddToAnalysisCreate
     * @summary Добавить жанр в черновик заявки
     * @request POST:/genres/add-to-analysis/{id}
     * @secure
     * @response `204` `void` Успешное добавление
     * @response `400` `HandlerErrorResponse` Неверный формат ID
     * @response `401` `HandlerErrorResponse` Неавторизован
     * @response `500` `HandlerErrorResponse` Ошибка сервера (например, жанр уже добавлен)
     */
    addToAnalysisCreate: (
      { id, ...query }: AddToAnalysisCreateParams,
      params: RequestParams = {},
    ) =>
      this.http.request<void, HandlerErrorResponse>({
        path: `/genres/add-to-analysis/${id}`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Возвращает информацию о конкретном жанре. Доступен публично.
     *
     * @tags Домен жанров
     * @name GenresDetail
     * @summary Получить жанр по ID
     * @request GET:/genres/{id}
     * @response `200` `DsGenreDTO` Информация о жанре
     * @response `400` `HandlerErrorResponse` Неверный формат ID
     * @response `404` `HandlerErrorResponse` Жанр не найден
     */
    genresDetail: (
      { id, ...query }: GenresDetailParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DsGenreDTO, HandlerErrorResponse>({
        path: `/genres/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет название и/или ключевые слова жанра по ID. Требуются права **Модератора**.
     *
     * @tags Домен жанров
     * @name GenresUpdate
     * @summary Обновить жанр
     * @request PUT:/genres/{id}
     * @secure
     * @response `200` `DsGenreDTO` Успешное обновление
     * @response `400` `HandlerErrorResponse` Неверный формат ID или данных
     * @response `403` `HandlerErrorResponse` Доступ запрещен (не модератор)
     * @response `404` `HandlerErrorResponse` Жанр не найден
     */
    genresUpdate: (
      { id, ...query }: GenresUpdateParams,
      request: DsUpdateGenreDTO,
      params: RequestParams = {},
    ) =>
      this.http.request<DsGenreDTO, HandlerErrorResponse>({
        path: `/genres/${id}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Устанавливает флаг is_deleted = true для жанра. Требуются права **Модератора**.
     *
     * @tags Домен жанров
     * @name GenresDelete
     * @summary Удалить жанр
     * @request DELETE:/genres/{id}
     * @secure
     * @response `204` `void` Успешное удаление
     * @response `400` `HandlerErrorResponse` Неверный формат ID
     * @response `403` `HandlerErrorResponse` Доступ запрещен (не модератор)
     * @response `500` `HandlerErrorResponse` Ошибка сервера
     */
    genresDelete: (
      { id, ...query }: GenresDeleteParams,
      params: RequestParams = {},
    ) =>
      this.http.request<void, HandlerErrorResponse>({
        path: `/genres/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Загружает и обновляет изображение для жанра по ID. Требуются права **Модератора**.
     *
     * @tags Домен жанров
     * @name ImageCreate
     * @summary Загрузить изображение жанра
     * @request POST:/genres/{id}/image
     * @secure
     * @response `200` `DsGenreDTO` Успешная загрузка, возвращает обновленный жанр
     * @response `400` `HandlerErrorResponse` Ошибка загрузки/формата файла
     * @response `403` `HandlerErrorResponse` Доступ запрещен (не модератор)
     * @response `500` `HandlerErrorResponse` Ошибка Minio/сервера
     */
    imageCreate: (
      { id, ...query }: ImageCreateParams,
      data: ImageCreatePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<DsGenreDTO, HandlerErrorResponse>({
        path: `/genres/${id}/image`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
  textAnalysisRequest = {
    /**
     * @description Для модератора - все заявки. Для создателя - только его заявки.
     *
     * @tags Домен заявки на анализ текста
     * @name TextAnalysisRequestList
     * @summary Получить список заявок
     * @request GET:/text-analysis-request
     * @secure
     * @response `200` `((DsAnalysisRequestDTO)[])[]` Список заявок
     * @response `401` `HandlerErrorResponse` Неавторизован
     */
    textAnalysisRequestList: (
      query: TextAnalysisRequestListParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DsAnalysisRequestDTO[][], HandlerErrorResponse>({
        path: `/text-analysis-request`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
 * @description Возвращает ID текущей черновой заявки и количество жанров в ней.
 *
 * @tags Домен заявки на анализ текста
 * @name IconList
 * @summary Получить информацию о черновике
 * @request GET:/text-analysis-request/icon
 * @secure
 * @response `200` `{
    analysis_request_id?: number,
    genres_in_request_count?: number,

}` Информация о черновике
 * @response `500` `HandlerErrorResponse` Ошибка сервера
 */
    iconList: (params: RequestParams = {}) =>
      this.http.request<
        {
          analysis_request_id?: number;
          genres_in_request_count?: number;
        },
        HandlerErrorResponse
      >({
        path: `/text-analysis-request/icon`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Домен заявки на анализ текста
     * @name TextAnalysisRequestDetail
     * @summary Получить одну заявку по id
     * @request GET:/text-analysis-request/{id}
     * @secure
     * @response `200` `(DsAnalysisRequestDTO)[]` Заявка
     * @response `401` `HandlerErrorResponse` Неавторизован
     */
    textAnalysisRequestDetail: (
      { id, ...query }: TextAnalysisRequestDetailParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DsAnalysisRequestDTO[], HandlerErrorResponse>({
        path: `/text-analysis-request/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  textAnalysisRequests = {
    /**
     * @description Обновляет поле 'TextToAnalyse' черновой заявки.
     *
     * @tags Домен заявки на анализ текста
     * @name TextAnalysisRequestsUpdate
     * @summary Обновить черновик
     * @request PUT:/text-analysis-requests/{id}
     * @secure
     * @response `200` `DsAnalysisRequestDTO` Успешное обновление
     * @response `400` `HandlerErrorResponse` Неверный формат ID или данных
     * @response `401` `HandlerErrorResponse` Неавторизован
     * @response `500` `HandlerErrorResponse` Ошибка сервера/Не является черновиком
     */
    textAnalysisRequestsUpdate: (
      { id, ...query }: TextAnalysisRequestsUpdateParams,
      request: DsUpdateAnalysisRequestDTO,
      params: RequestParams = {},
    ) =>
      this.http.request<DsAnalysisRequestDTO, HandlerErrorResponse>({
        path: `/text-analysis-requests/${id}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет заявку (только черновик).
     *
     * @tags Домен заявки на анализ текста
     * @name TextAnalysisRequestsDelete
     * @summary Удалить черновик заявки
     * @request DELETE:/text-analysis-requests/{id}
     * @secure
     * @response `204` `void` Успешное удаление
     * @response `400` `HandlerErrorResponse` Неверный формат ID
     * @response `401` `HandlerErrorResponse` Неавторизован
     * @response `500` `HandlerErrorResponse` Ошибка сервера/Не является черновиком
     */
    textAnalysisRequestsDelete: (
      { id, ...query }: TextAnalysisRequestsDeleteParams,
      params: RequestParams = {},
    ) =>
      this.http.request<void, HandlerErrorResponse>({
        path: `/text-analysis-requests/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Переводит статус черновика на 'на модерации'.
     *
     * @tags Домен заявки на анализ текста
     * @name FormUpdate
     * @summary Отправить заявку на модерацию
     * @request PUT:/text-analysis-requests/{id}/form
     * @secure
     * @response `200` `DsAnalysisRequestDTO` Успешная отправка
     * @response `400` `HandlerErrorResponse` Неверный формат ID
     * @response `401` `HandlerErrorResponse` Неавторизован
     * @response `500` `HandlerErrorResponse` Ошибка сервера/Не является черновиком
     */
    formUpdate: (
      { id, ...query }: FormUpdateParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DsAnalysisRequestDTO, HandlerErrorResponse>({
        path: `/text-analysis-requests/${id}/form`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Домен заявки на анализ текста
     * @name ProcessUpdate
     * @summary Завершить или отклонить заявку (Только для Модератора)
     * @request PUT:/text-analysis-requests/{id}/process
     * @secure
     * @response `200` `DsAnalysisRequestDTO` Обновленная заявка
     * @response `401` `HandlerErrorResponse` Неавторизован
     * @response `403` `HandlerErrorResponse` Доступ запрещен (не модератор)
     * @response `404` `HandlerErrorResponse` Заявка не найдена
     */
    processUpdate: (
      { id, ...query }: ProcessUpdateParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DsAnalysisRequestDTO, HandlerErrorResponse>({
        path: `/text-analysis-requests/${id}/process`,
        method: "PUT",
        query: query,
        secure: true,
        ...params,
      }),
  };
  user = {
    /**
     * No description
     *
     * @tags Домен пользователя
     * @name LoginCreate
     * @summary Аутентификация пользователя
     * @request POST:/user/login
     * @response `200` `DsAuthResponseDTO` Успешный вход
     * @response `400` `HandlerErrorResponse` Неверный запрос
     * @response `401` `HandlerErrorResponse` Неавторизован
     */
    loginCreate: (user: DsChangeUserDTO, params: RequestParams = {}) =>
      this.http.request<DsAuthResponseDTO, HandlerErrorResponse>({
        path: `/user/login`,
        method: "POST",
        body: user,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Домен пользователя
     * @name LogoutCreate
     * @summary Выход из системы
     * @request POST:/user/logout
     * @secure
     * @response `204` `void` Успешный выход
     * @response `401` `HandlerErrorResponse` Неавторизован (отсутствует токен)
     * @response `500` `HandlerErrorResponse` Ошибка Redis/сервера
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.http.request<void, HandlerErrorResponse>({
        path: `/user/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Домен пользователя
     * @name ProfileList
     * @summary Получить профиль
     * @request GET:/user/profile
     * @secure
     * @response `200` `DsUserDTO` Данные пользователя
     * @response `401` `HandlerErrorResponse` Неавторизован
     * @response `404` `HandlerErrorResponse` Пользователь не найден (редкий случай)
     */
    profileList: (params: RequestParams = {}) =>
      this.http.request<DsUserDTO, HandlerErrorResponse>({
        path: `/user/profile`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Домен пользователя
     * @name ProfileUpdate
     * @summary Обновить профиль
     * @request PUT:/user/profile
     * @secure
     * @response `200` `DsUserDTO` Успешное обновление
     * @response `400` `HandlerErrorResponse` Неверный формат данных
     * @response `401` `HandlerErrorResponse` Неавторизован
     * @response `500` `HandlerErrorResponse` Ошибка сервера
     */
    profileUpdate: (request: DsChangeUserDTO, params: RequestParams = {}) =>
      this.http.request<DsUserDTO, HandlerErrorResponse>({
        path: `/user/profile`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Домен пользователя
     * @name RegisterCreate
     * @summary Регистрация нового пользователя
     * @request POST:/user/register
     * @response `204` `void` Успешная регистрация
     * @response `400` `HandlerErrorResponse` Неверный формат данных
     * @response `500` `HandlerErrorResponse` Ошибка сервера или пользователь с таким логином уже существует
     */
    registerCreate: (request: DsChangeUserDTO, params: RequestParams = {}) =>
      this.http.request<void, HandlerErrorResponse>({
        path: `/user/register`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        ...params,
      }),
  };
}

/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface User {
  /**
   * Email адрес
   * @format email
   * @minLength 1
   * @maxLength 254
   */
  email: string;
  /**
   * Пароль
   * @minLength 1
   * @maxLength 100
   */
  password: string;
  /**
   * Is staff
   * @default false
   */
  is_staff?: boolean;
  /**
   * Is superuser
   * @default false
   */
  is_superuser?: boolean;
  first_name?: string;
  last_name?: string;
}

export interface SportApplication {
  /** ID */
  pk?: number;
  /** Status */
  status?: "draft" | "deleted" | "created" | "completed" | "rejected";
  /**
   * Creation date
   * @format date-time
   */
  creation_date?: string;
  /**
   * Apply date
   * @format date-time
   */
  apply_date?: string | null;
  /**
   * End date
   * @format date-time
   */
  end_date?: string | null;
  /**
   * Creator
   * @format email
   * @minLength 1
   */
  creator?: string;
  /** Moderator */
  moderator?: string;
  /**
   * Full name
   * @maxLength 100
   */
  full_name?: string | null;
  /**
   * Number of sections
   * @min -2147483648
   * @max 2147483647
   */
  number_of_sections?: number | null;
}

export interface Section {
  /** ID */
  pk?: number;
  /**
   * Title
   * @minLength 1
   * @maxLength 100
   */
  title: string;
  /**
   * Description
   * @minLength 1
   * @maxLength 500
   */
  description?: string;
  /**
   * Location
   * @minLength 1
   * @maxLength 200
   */
  location?: string;
  /**
   * Date
   * @format date-time
   */
  date?: string;
  /**
   * Instructor
   * @minLength 1
   * @maxLength 100
   */
  instructor?: string;
  /**
   * Duration
   * @min -2147483648
   * @max 2147483647
   */
  duration?: number;
  /**
   * ImageUrl
   * @format uri
   * @maxLength 200
   */
  imageUrl?: string | null;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
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

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

function getCsrfToken() {
    const csrfCookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken'));
    return csrfCookie ? csrfCookie.split('=')[1] : '';
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://127.0.0.1:8000" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;

    this.instance.interceptors.request.use(config => {
        const csrfToken = getCsrfToken();
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }
        return config;
    })
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
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
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
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
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Snippets API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://127.0.0.1:8000
 * @contact <contact@snippets.local>
 *
 * Test description
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Класс, описывающий методы работы с пользователями Осуществляет связь с таблицей пользователей в базе данных
     *
     * @tags api
     * @name ApiUserList
     * @request GET:/api/user/
     * @secure
     */
    apiUserList: (params: RequestParams = {}) =>
      this.request<User[], any>({
        path: `/api/user/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Функция регистрации новых пользователей Если пользователя c указанным в request email ещё нет, в БД будет добавлен новый пользователь.
     *
     * @tags api
     * @name ApiUserCreate
     * @summary Регистрация
     * @request POST:/api/user/
     * @secure
     */
    apiUserCreate: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/api/user/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Класс, описывающий методы работы с пользователями Осуществляет связь с таблицей пользователей в базе данных
     *
     * @tags api
     * @name ApiUserRead
     * @request GET:/api/user/{id}/
     * @secure
     */
    apiUserRead: (id: number, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/api/user/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Класс, описывающий методы работы с пользователями Осуществляет связь с таблицей пользователей в базе данных
     *
     * @tags api
     * @name ApiUserUpdate
     * @request PUT:/api/user/{id}/
     * @secure
     */
    apiUserUpdate: (id: number, data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/api/user/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Класс, описывающий методы работы с пользователями Осуществляет связь с таблицей пользователей в базе данных
     *
     * @tags api
     * @name ApiUserPartialUpdate
     * @request PATCH:/api/user/{id}/
     * @secure
     */
    apiUserPartialUpdate: (id: number, data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/api/user/${id}/`,
        method: "PATCH",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Класс, описывающий методы работы с пользователями Осуществляет связь с таблицей пользователей в базе данных
     *
     * @tags api
     * @name ApiUserDelete
     * @request DELETE:/api/user/{id}/
     * @secure
     */
    apiUserDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/user/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  applications = {
    /**
     * No description
     *
     * @tags applications
     * @name ApplicationsList
     * @summary Список заявок
     * @request GET:/applications/
     * @secure
     */
    applicationsList: (
      query?: {
        status?: string;
        apply_date?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          applications?: {
            pk?: number;
            status?: string;
            creation_date?: string;
            apply_date?: string;
            end_date?: string;
            creator?: string;
            moderator?: number;
            full_name?: string;
            number_of_sections?: string;
          }[];
        },
        any
      >({
        path: `/applications/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags applications
     * @name ApplicationsDraftCreate
     * @summary Добавление в заявку-черновик
     * @request POST:/applications/draft/
     * @secure
     */
    applicationsDraftCreate: (
      data: {
        section_id: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<{
        draft_application_id: number
      }, void>({
        path: `/applications/draft/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags applications
     * @name ApplicationsRead
     * @summary Одна заявка
     * @request GET:/applications/{application_id}/
     * @secure
     */
    applicationsRead: (applicationId: string, params: RequestParams = {}) =>
      this.request<
        {
          application?: {
            pk?: number;
            status?: string;
            creation_date?: string;
            apply_date?: string;
            end_date?: string;
            creator?: string;
            moderator?: number;
            full_name?: string;
            number_of_sections?: string;
          };
          sections?: {
            pk?: number;
            title?: string;
            description?: string;
            location?: string;
            date?: string;
            instructor?: string;
            duration?: number;
            imageUrl?: string;
          }[];
        },
        any
      >({
        path: `/applications/${applicationId}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags applications
     * @name ApplicationsUpdate
     * @summary Изменение доп. полей заявки
     * @request PUT:/applications/{application_id}/
     * @secure
     */
    applicationsUpdate: (applicationId: string, data: SportApplication, params: RequestParams = {}) =>
      this.request<SportApplication, any>({
        path: `/applications/${applicationId}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags applications
     * @name ApplicationsDelete
     * @summary Удаление заявки
     * @request DELETE:/applications/{application_id}/
     * @secure
     */
    applicationsDelete: (applicationId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/applications/${applicationId}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags applications
     * @name ApplicationsApproveRejectUpdate
     * @summary Завершить/отклонить модератором
     * @request PUT:/applications/{application_id}/approve-reject/
     * @secure
     */
    applicationsApproveRejectUpdate: (
      applicationId: string,
      data: {
        /** 'completed' or 'rejected' */
        status: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<SportApplication, void>({
        path: `/applications/${applicationId}/approve-reject/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags applications
     * @name ApplicationsPriorityUpdate
     * @summary Уменьшить значение приоритета секции в заявке
     * @request PUT:/applications/{application_id}/priority/{section_id}
     * @secure
     */
    applicationsPriorityUpdate: (applicationId: string, sectionId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/applications/${applicationId}/priority/${sectionId}`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags applications
     * @name ApplicationsPriorityDelete
     * @summary Удалить секцию из заявки
     * @request DELETE:/applications/{application_id}/priority/{section_id}
     * @secure
     */
    applicationsPriorityDelete: (applicationId: string, sectionId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/applications/${applicationId}/priority/${sectionId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags applications
     * @name ApplicationsSubmitUpdate
     * @summary Сформировать создателем
     * @request PUT:/applications/{application_id}/submit/
     * @secure
     */
    applicationsSubmitUpdate: (applicationId: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/applications/${applicationId}/submit/`,
        method: "PUT",
        secure: true,
        ...params,
      }),
  };
  login = {
    /**
     * No description
     *
     * @tags login
     * @name LoginCreate
     * @summary Аутентификация
     * @request POST:/login/
     * @secure
     */
    loginCreate: (
      data: {
        email: string;
        password: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          pk: number,
          email: string;
          password: string;
        },
        any
      >({
        path: `/login/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  logout = {
    /**
     * No description
     *
     * @tags logout
     * @name LogoutCreate
     * @summary Деавторизация
     * @request POST:/logout/
     * @secure
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/logout/`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  sections = {
    /**
     * No description
     *
     * @tags sections
     * @name SectionsList
     * @summary Список секций
     * @request GET:/sections/
     * @secure
     */
    sectionsList: (
      query?: {
        section_title?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          sections?: {
            pk?: number;
            title?: string;
            description?: string;
            location?: string;
            date?: string;
            instructor?: string;
            duration?: number;
            imageUrl?: string;
          }[];
          draft_application_id?: number;
          number_of_sections?: number;
        },
        any
      >({
        path: `/sections/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags sections
     * @name SectionsCreate
     * @summary Добавление секции
     * @request POST:/sections/
     * @secure
     */
    sectionsCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/sections/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags sections
     * @name SectionsRead
     * @summary Одна секция
     * @request GET:/sections/{section_id}/
     * @secure
     */
    sectionsRead: (sectionId: string, params: RequestParams = {}) =>
      this.request<Section, any>({
        path: `/sections/${sectionId}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags sections
     * @name SectionsChangeUpdate
     * @summary Изменение секции
     * @request PUT:/sections/{section_id}/change/
     * @secure
     */
    sectionsChangeUpdate: (sectionId: string, data: Section, params: RequestParams = {}) =>
      this.request<Section, any>({
        path: `/sections/${sectionId}/change/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags sections
     * @name SectionsDeleteDelete
     * @summary Удаление секции
     * @request DELETE:/sections/{section_id}/delete/
     * @secure
     */
    sectionsDeleteDelete: (sectionId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/sections/${sectionId}/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags sections
     * @name SectionsUploadImageCreate
     * @summary Добавление изображения
     * @request POST:/sections/{section_id}/upload_image/
     * @secure
     */
    sectionsUploadImageCreate: (sectionId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/sections/${sectionId}/upload_image/`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
}

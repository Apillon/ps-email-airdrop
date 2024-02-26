import qs from 'query-string';

class Api {
  settings: { headers: Headers; basePath: string; publicPath: string } = {
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }),
    basePath: '',
    publicPath: '',
  };

  async post<T>(path: string, data?: any, isPublic = false, requestOptions?: RequestInit) {
    this.initSettings();

    const requestData = {
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
    };

    const response = await fetch(
      (isPublic ? this.settings.publicPath : this.settings.basePath) + path,
      this.onRequest(requestData, requestOptions)
    );

    return this.onResponse<T>(response, { ...requestData, path });
  }

  async get<T>(
    path: string,
    query?: { [k: string]: string | number | boolean | null | Array<string | number> },
    isPublic = false,
    requestOptions?: RequestInit
  ) {
    this.initSettings();

    const q = !query ? '' : '?' + qs.stringify(query, { arrayFormat: 'index' });
    const requestData = { method: 'GET', query: q };

    const response = await fetch(
      (isPublic ? this.settings.publicPath : this.settings.basePath) + path + q,
      this.onRequest(requestData, requestOptions)
    );

    return this.onResponse<T>(response, { ...requestData, path });
  }

  async put<T>(path: string, data?: any, isPublic = false, requestOptions?: RequestInit) {
    this.initSettings();

    const requestData = {
      method: 'PUT',
      body: data ? JSON.stringify(data) : null,
    };

    const response = await fetch(
      (isPublic ? this.settings.publicPath : this.settings.basePath) + path,
      this.onRequest(requestData, requestOptions)
    );

    return this.onResponse<T>(response, { ...requestData, path });
  }

  async patch<T>(path: string, data?: any, isPublic = false, requestOptions?: RequestInit) {
    this.initSettings();

    const requestData = {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : null,
    };

    const response = await fetch(
      (isPublic ? this.settings.publicPath : this.settings.basePath) + path,
      this.onRequest(requestData, requestOptions)
    );

    return this.onResponse<T>(response, { ...requestData, path });
  }

  async delete(path: string, isPublic = false, requestOptions?: RequestInit) {
    this.initSettings();

    const requestData = {
      method: 'DELETE',
      headers: this.settings.headers,
    };

    const response = await fetch(
      (isPublic ? this.settings.publicPath : this.settings.basePath) + path,
      this.onRequest(requestData, requestOptions)
    );

    return this.onResponse(response, { ...requestData, path });
  }

  setToken(token: string) {
    this.settings.headers.set('Authorization', 'Bearer ' + token);
  }

  clearToken() {
    this.settings.headers.delete('Authorization');
  }

  initSettings() {
    if (!this.settings.basePath) {
      const config = useRuntimeConfig();
      this.settings.basePath = removeLastSlash(config.public.API_BASE || '');
    }
  }

  onRequest(request: Request | any, requestOptions: RequestInit = {}) {
    const modifiedRequest = { ...request, ...requestOptions };

    modifiedRequest.headers = this.settings.headers;

    return modifiedRequest;
  }

  async onResponse<T>(response: Response, requestData: Request | any) {
    if (response.status > 250) {
      let errorData = { message: '' };

      try {
        errorData = await response.json();
      } catch (_e) {}

      const error = new Error(`API Error`) as any;
      error.data = errorData;

      if (response.status === 403) {
        this.onForbidden(errorData, requestData);
      }

      throw error;
    }

    let returnedResponse = null;

    try {
      const contentType = response.headers.get('Content-Type') || '';
      if (contentType.includes('application/json')) {
        returnedResponse = await response.json();
      } else {
        returnedResponse = await response.text();
      }
    } catch (_e) {}

    return returnedResponse as T;
  }

  onForbidden(_errorData: any, _requestData: Request | any) {
    const route = useRoute();
    const router = useRouter();
    const user = useUserStore();

    /**
     * User does not have permission to view resource.
     * Log them out and redirect to login page.
     */
    if (user.loggedIn) {
      user.logout();
    }

    router.replace({ path: '/' });
  }
}

export const $api = new Api();

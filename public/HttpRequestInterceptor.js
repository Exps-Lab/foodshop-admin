// todo 
// - 需要支持：
// 1. 全局promise错误拦截并上报
// 2. app.config.errorHandler 拦截并上报错误
// - 需要封装：
// 统一上报错误信息和方法

(function () {
  // 保存原始的方法
  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url) {
    this._httpMethod = method;
    this._httpURL = url;
    return originalOpen.apply(this, arguments);
  };

  // 构建上报数据
  const buildReport = (xhr, type, extra) => {
    // 记录请求参数，GET 时从 URL 查询字符串提取
    if (xhr._httpMethod && xhr._httpMethod.toUpperCase() === 'GET') {
      try {
        const urlObj = new URL(xhr._httpURL, window.location.origin);
        const params = Object.fromEntries(urlObj.searchParams.entries());
        xhr._httpBody = params;
      } catch {
        xhr._httpBody = null;
      }
    } else {
      xhr._httpBody = arguments[0] ?? {};
    }

    const base = {
      method: xhr._httpMethod,
      url: xhr._httpURL,
      headers: xhr._httpHeaders || {},
      params: xhr._httpBody,
    };
    return {
      ...base,
      type,
      ...extra
    };
  };

  // 重写 send，统一拦截请求与响应，并监听错误
  XMLHttpRequest.prototype.send = function () {
    if (!this.__intercepted__) {
      this.addEventListener('loadend', () => {
        try {
          const { status, responseText } = this;
          if (status !== 200) {
            const payload = buildReport(this, 'HttpErrorResponse', {
              status,
              response: typeof responseText === 'string'
                ? responseText
                : JSON.stringify(responseText),
            });
            console.error('[HTTP-Report]', payload);
          }
        } catch (err) {
          console.error('[XHR-Loadend] error:', err);
        }
      });

      // 错误（网络错误、跨域等）监听
      this.addEventListener('error', event => {
        const errPayload = buildReport(this, 'NetworkError', {
            errorEvent: event,
            message: 'Network or CORS Error',
        });
        console.error('[HTTP-Report]', errPayload);
      });

      this.__intercepted__ = true;
    }

    return originalSend.apply(this, arguments);
  };
})();
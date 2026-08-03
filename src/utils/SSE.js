/**
 * SSE (Server-Sent Events) 通用工具
 * 与业务解耦，仅暴露 fetchSSEStream，可复用于任意流式接口场景
 */

const DATA_PREFIX = 'data:'

/**
 * 读取并解析 SSE 响应体，逐个事件回调（内部实现，不对外暴露）
 * @param { Response } response fetch 响应对象
 * @param { (eventData: object | string) => (void | false) } onEvent 事件处理函数，返回 false 提前停止读取
 */
async function readSSEStream (response, onEvent) {
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    // 按双换行符分割 SSE 事件块
    const chunks = buffer.split('\n\n')
    buffer = chunks.pop() // 保留不完整的块在缓冲区中

    for (const chunk of chunks) {
      // SSE 规范允许同一事件包含多行 data，以换行符拼接
      const data = chunk.split('\n')
        .filter(line => line.startsWith(DATA_PREFIX))
        .map(line => line.slice(DATA_PREFIX.length).replace(/^ /, ''))
        .join('\n')
      if (!data) continue

      // 优先按 JSON 解析，失败则回退为原始文本，由业务方自行处理
      let eventData = data
      try {
        eventData = JSON.parse(data)
      } catch (e) {
        console.warn('SSE JSON 解析失败，回退为原始文本:', data, e)
      }

      // 事件处理中抛出的错误向上冒泡，由调用方统一处理
      if (onEvent(eventData) === false) {
        reader.cancel()
        return
      }
    }
  }
}

/**
 * 发起 SSE 流式请求并读取事件
 * @param { string } url 请求地址
 * @param { (eventData: object | string) => (void | false) } onEvent 事件处理函数，返回 false 提前停止读取
 * @param { object } fetchOptions fetch 配置（headers、signal 等）
 * @returns { Promise<void> } 流读取完毕（或被 onEvent 提前终止）时 resolve
 */
export async function fetchSSEStream (url, onEvent, fetchOptions = {}) {
  const response = await fetch(url, {
    method: 'GET',
    ...fetchOptions
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  await readSSEStream(response, onEvent)
}

// import React, { useState } from "react"
// import { render, waitFor, screen } from '@testing-library/react'
// import userEvent from '@testing-library/user-event';
// // 延迟函数
// function sleep(timeout: number): Promise<void> {
//     return new Promise((resolve, _reject) => {
//         setTimeout(resolve, timeout)
//     })
// }
// // 请求函数
// let queryCount = 0
// const queryFnSuccess = async () => {
//     queryCount++
//     await sleep(10)
//     return Promise.resolve('testData')
// }
// const queryFnUnsuccess = async () => {
//     queryCount++
//     await sleep(10)
//     return Promise.reject('rejected')
// }
// const queryAfterSuccess = async () => {
//     await sleep(10)
//     if (queryCount === 0) {
//         queryCount++
//         return Promise.reject('rejected')
//     }
//     else {
//         queryCount++
//         return Promise.resolve('testData')
//     }
// }
// const queryFnUndefined = async () => {
//     queryCount++
//     await sleep(10)
//     return Promise.resolve(undefined)
// }
// // 每个测试结束需要重置store
// let store;
// beforeEach(() => {
//     queryCount = 0
//     store = new 
// })
// afterEach(() => {
//     queryCount = 0
//     jest.clearAllTimers()
//     window.LzyReactQueryClient = undefined
// })
// describe('useQuery', () => {
//     it('should return correct state for a successful query', async () => {
//         const key = ['queryKey_1']
//         const results: any[] = []
//         function Page() {
//             const result = useQuery(key, queryFnSuccess)
//             results.push(result)
//             return <div>{result.data}</div>
//         }
//         // 使用@testing-library/react的render测试渲染组件 (可执行钩子和自定义钩子)
//         const rendered = render(<Page />)
//         // waitFor 等待渲染结果(当得到渲染结果"data:data"时)
//         await waitFor(() => rendered.getByText('testData'))
//         // 进行结果判断
//         expect(results.length).toEqual(2)
//         expect(results[0]).toEqual({
//             data: undefined,
//             status: 'loading',
//             fetchStatus: 'fetching',
//             error: null,
//             isStale: expect.any(Function),
//             refetch: expect.any(Function),
//             remove: expect.any(Function),
//         })
//         expect(results[1]).toEqual({
//             data: 'testData',
//             status: 'success',
//             fetchStatus: 'idle',
//             error: null,
//             isStale: expect.any(Function),
//             refetch: expect.any(Function),
//             remove: expect.any(Function),
//         })
//     })
//     it('should return correct state for a unsuccessful query', async () => {
//         const key = ['queryKey_1']
//         const results: any[] = []
//         function Page() {
//             const result = useQuery(key, queryFnUnsuccess, { retry: 2, retryDelay: 10 })
//             results.push(result)
//             return <h1>Status:{result.status}</h1>
//         }
//         const rendered = render(<Page />)
//         await waitFor(() => rendered.getByText('Status:error'))
//         expect(results.length).toEqual(2)// 错误请求不会render页面
//         expect(results[0]).toEqual({
//             data: undefined,
//             status: 'loading',
//             fetchStatus: 'fetching',
//             error: null,
//             isStale: expect.any(Function),
//             refetch: expect.any(Function),
//             remove: expect.any(Function),
//         })
//         expect(results[1]).toEqual({
//             data: undefined,
//             status: 'error',
//             fetchStatus: 'idle',
//             error: 'rejected',
//             isStale: expect.any(Function),
//             refetch: expect.any(Function),
//             remove: expect.any(Function),
//         })
//     })
//     it('should allow to set default data value', async () => {
//         const key = ['queryKey_1']
//         function Page() {
//             const { data = 'default' } = useQuery(key, queryFnSuccess)
//             return <div>{data}</div>
//         }
//         const rendered = render(<Page />)
//         rendered.getByText('default')
//         await waitFor(() => rendered.getByText('testData'))
//     })
//     it('should call onSuccess after a query has been fetched', async () => {
//         const key = ['queryKey_1']
//         const states: any[] = []
//         const onSuccess = jest.fn()
//         function Page() {
//             const state = useQuery(key, queryFnSuccess, { onSuccess })
//             states.push(state)
//             return <div>Status:{state.status}</div>
//         }
//         const rendered = render(<Page />)
//         await rendered.findByText('Status:success')
//         expect(onSuccess).toHaveBeenCalledTimes(1)
//         expect(onSuccess).toHaveBeenCalledWith('testData')
//     })
//     it('should call onSuccess after a query has been refetched', async () => {
//         const key = ['queryKey_1']
//         const states: any[] = []
//         const onSuccess = jest.fn()
//         const onFail = jest.fn()
//         function Page() {
//             const state = useQuery(key, queryAfterSuccess, { retry: 3, retryDelay: 10, onSuccess, onFail })
//             states.push(state)
//             return <div>Status:{state.status}</div>
//         }
//         const rendered = render(<Page />)
//         await rendered.findByText('Status:success')
//         expect(onFail).toHaveBeenCalledTimes(1)
//         expect(onSuccess).toHaveBeenCalledTimes(1)
//         expect(onSuccess).toHaveBeenCalledWith('testData')
//     })
//     it('失败后应该执行retry次数的请求', async () => {
//         const key = ['queryKey_1']
//         const states: any[] = []
//         function Page() {
//             const state = useQuery(key, queryFnUnsuccess, { retry: 3, retryDelay: 10 })
//             return <div>Status:{state.status}</div>
//         }
//         const rendered = render(<Page />)
//         await rendered.findByText('Status:error')
//         expect(queryCount).toBe(4)
//     })
//     it('retry设置为false时不执行', async () => {
//         const key = ['queryKey_1']
//         const states: any[] = []
//         function Page() {
//             const state = useQuery(key, queryFnUnsuccess, { retry: false, retryDelay: 10 })
//             return <div>Status:{state.status}</div>
//         }
//         const rendered = render(<Page />)
//         await rendered.findByText('Status:error')
//         expect(queryCount).toBe(1)
//     })
//     it('失败retry后应该执行onFail回调', async () => {
//         const key = ['queryKey_1']
//         const states: any[] = []
//         const onFail = jest.fn()
//         function Page() {
//             const state = useQuery(key, queryFnUnsuccess, { retry: 3, retryDelay: 10, onFail })
//             return <div>Status:{state.status}</div>
//         }
//         const rendered = render(<Page />)
//         await rendered.findByText('Status:error')
//         expect(onFail).toHaveBeenCalledTimes(3)
//     })
//     it('error后应该执行onError回调', async () => {
//         const key = ['queryKey_1']
//         const onError = jest.fn()
//         function Page() {
//             const state = useQuery(key, queryFnUnsuccess, { retry: 3, retryDelay: 10, onError })
//             return <div>Status:{state.status}</div>
//         }
//         const rendered = render(<Page />)
//         await rendered.findByText('Status:error')
//         expect(onError).toHaveBeenCalledTimes(1)
//         expect(onError).toHaveBeenCalledWith('rejected')
//     })
//     it('queryFn未返回结果时应展示错误', async () => {
//         const key = ['queryKey_1']
//         const states: any[] = []
//         const onError = jest.fn()
//         function Page() {
//             const state = useQuery(key, queryFnUndefined, { retry: 3, retryDelay: 10, onError })
//             states.push(state)
//             return <div>Status:{state.status}</div>
//         }
//         const rendered = render(<Page />)
//         await rendered.findByText('Status:error')
//         expect(states[1].error).toEqual(new Error('Query data cannot be undefined'))
//         expect(onError).toHaveBeenCalledTimes(1)
//         expect(onError).toHaveBeenCalledWith(new Error('Query data cannot be undefined'))
//     })
//     // it('没有queryFn时应展示错误', async () => {
//     //     const key = ['queryKey_1']
//     //     const states: any[] = []
//     //     const onError = jest.fn()
//     //     function Page() {
//     //         const state = useQuery(key, null, { retry: 3, retryDelay: 10, onError })
//     //         states.push(state)
//     //         return <div>Status:{state.status}</div>
//     //     }
//     //     const rendered = render(<Page />)
//     //     await rendered.findByText('Status:error')
//     //     expect(states[0].error).toEqual(new Error('Missing queryFn'))
//     //     expect(onError).toHaveBeenCalledTimes(1)
//     //     expect(onError).toHaveBeenCalledWith(new Error('Missing queryFn'))
//     // })
//     it('组件unmount时不应执行onSuccess', async () => {
//         const key = ['queryKey_1']
//         const states: any[] = []
//         const onSuccess = jest.fn()
//         function Page() {
//             const [show, setShow] = React.useState(false)
//             return show ? <ComponentA /> : <ComponentB />
//         }
//         function ComponentB() {
//             return <div>B</div>
//         }
//         function ComponentA() {
//             const state = useQuery(key, queryFnSuccess, { retry: 3, retryDelay: 10, onSuccess })
//             states.push(state)
//             return <div>A</div>
//         }
//         const rendered = render(<Page />)
//         jest.setTimeout(500)
//         expect(states.length).toBe(0)
//         expect(onSuccess).toHaveBeenCalledTimes(0)
//     })
//     it('查询isStale数据是否新鲜应该返回正确结果', async () => {
//         jest.useFakeTimers(); // 使用假的定时器
//         const key = ['queryKey_1']
//         const states: any[] = []
//         function Page() {
//             const state = useQuery(key, queryFnSuccess, { staleTime: 2000 })
//             states.push(state)
//             return <div>Status:{state.status}</div>
//         }
//         const rendered = render(<Page />)
//         await rendered.findByText('Status:success')
//         //! 正常在jest中写setTimeout等是不会执行的
//         setTimeout(() => {
//             const isStale = states[1].isStale() // 1s后数据新鲜
//             expect(isStale).toEqual(true)
//         }, 1000)
//         setTimeout(() => {
//             const isStale = states[1].isStale() // 3s后数据不新鲜
//             expect(isStale).toEqual(false)
//         }, 3000)
//         jest.runAllTimers();// 快进 立即执行所有定时器
//         jest.clearAllTimers()
//     })
//     it('状态为success时,数据不新鲜时,render页面重新发起请求', async () => {
//         jest.useFakeTimers();
//         const key = ['queryKey_1']
//         const states: any[] = []
//         function Page() {
//             const [num, setNum] = React.useState(0)
//             const state = useQuery(key, queryFnSuccess, { staleTime: 2000 })
//             states.push(state)
//             return (<>
//                 <div>Status:{state.status}</div>
//                 <button onClick={() => { setNum(num + 1) }}>click Render</button>
//             </>)
//         }
//         const rendered = render(<Page />)
//         await rendered.findByText('Status:success')
//         expect(queryCount).toEqual(1)
//         setTimeout(async () => {
//             userEvent.click(screen.getByText('click Render'))
//             rendered.findByText('Status:loading')
//             expect(queryCount).toEqual(2)
//         }, 3000)
//         jest.runAllTimers();
//     })
//     it('状态为success时,数据依然新鲜,render页面不重新发起请求', async () => {
//         jest.useFakeTimers();
//         const key = ['queryKey_1']
//         const states: any[] = []
//         function Page() {
//             const [num, setNum] = React.useState(0)
//             const state = useQuery(key, queryFnSuccess, { staleTime: 2000 })
//             states.push(state)
//             return (<>
//                 <div>Status:{state.status}</div>
//                 <button onClick={() => { setNum(num + 1) }}>click Render</button>
//             </>)
//         }
//         const rendered = render(<Page />)
//         await rendered.findByText('Status:success')
//         expect(queryCount).toEqual(1)
//         setTimeout(() => {
//             userEvent.click(screen.getByText('click Render'))
//             rendered.findByText('Status:success')
//             expect(queryCount).toEqual(1)
//         }, 1000)
//         setTimeout(async () => {
//             userEvent.click(screen.getByText('click Render'))
//             rendered.findByText('Status:loading')
//             expect(queryCount).toEqual(2)
//         }, 3000)
//         jest.runAllTimers();// 快进 立即执行所有定时器
//     })
//     it('状态为error时,无论是否新鲜,render页面不重新发起请求', async () => {
//         jest.useFakeTimers();
//         const key = ['queryKey_1']
//         const states: any[] = []
//         function Page() {
//             const [num, setNum] = React.useState(0)
//             const state = useQuery(key, queryFnUnsuccess, { retry: false, retryDelay: 10, staleTime: 2000 })
//             states.push(state)
//             return (<>
//                 <div>Status:{state.status}</div>
//                 <button onClick={() => { setNum(num + 1) }}>click Render</button>
//             </>)
//         }
//         const rendered = render(<Page />)
//         await rendered.findByText('Status:error')
//         expect(queryCount).toEqual(1)
//         setTimeout(() => {
//             userEvent.click(screen.getByText('click Render'))
//             rendered.findByText('Status:error')
//             expect(queryCount).toEqual(1)
//         }, 1000)
//         setTimeout(async () => {
//             userEvent.click(screen.getByText('click Render'))
//             rendered.findByText('Status:error')
//             expect(queryCount).toEqual(1)
//         }, 3000)
//         jest.runAllTimers();// 快进 立即执行所有定时器
//     })
//     it('手动执行refetch后发起请求', async () => {
//         const key = ['queryKey_1']
//         const states: any[] = []
//         function Page() {
//             const [num, setNum] = React.useState(0)
//             const state = useQuery(key, queryFnSuccess, { staleTime: 2000 })
//             states.push(state)
//             return (<>
//                 <div>Status:{state.status}</div>
//                 <button onClick={() => { state.refetch() }}>Refetch</button>
//             </>)
//         }
//         const rendered = render(<Page />)
//         await rendered.findByText('Status:success')
//         expect(queryCount).toEqual(1)
//         await userEvent.click(screen.getByText('Refetch'))
//         await rendered.findByText('Status:success')
//         expect(queryCount).toEqual(2)
//     })
//     it('手动执行refetch后重启success请求并返回正确结果', async () => {
//         const key = ['queryKey_1']
//         const states: any[] = []
//         function Page() {
//             const state = useQuery(key, queryFnSuccess, { staleTime: 2000 })
//             states.push(state)
//             return (<>
//                 <div>Status:{state.status}</div>
//                 <button onClick={() => { state.refetch() }}>Refetch</button>
//             </>)
//         }
//         const rendered = render(<Page />)
//         await rendered.findByText('Status:success')
//         expect(queryCount).toEqual(1)
//         expect(states.length).toEqual(2)
//         await userEvent.click(screen.getByText('Refetch'))
//         await rendered.findByText('Status:success')
//         expect(queryCount).toEqual(2)
//         expect(states.length).toEqual(4)
//         expect(states[0]).toEqual({
//             data: undefined,
//             status: 'loading',
//             fetchStatus: 'fetching',
//             error: null,
//             isStale: expect.any(Function),
//             refetch: expect.any(Function),
//             remove: expect.any(Function),
//         })
//         expect(states[1]).toEqual({
//             data: 'testData',
//             status: 'success',
//             fetchStatus: 'idle',
//             error: null,
//             isStale: expect.any(Function),
//             refetch: expect.any(Function),
//             remove: expect.any(Function),
//         })
//         expect(states[2]).toEqual({
//             data: 'testData',
//             status: 'loading',
//             fetchStatus: 'fetching',
//             error: null,
//             isStale: expect.any(Function),
//             refetch: expect.any(Function),
//             remove: expect.any(Function),
//         })
//         expect(states[3]).toEqual({
//             data: 'testData',
//             status: 'success',
//             fetchStatus: 'idle',
//             error: null,
//             isStale: expect.any(Function),
//             refetch: expect.any(Function),
//             remove: expect.any(Function),
//         })
//     })
//     it('手动执行refetch后重启fail请求并返回正确结果', async () => {
//         const key = ['queryKey_1']
//         const states: any[] = []
//         function Page() {
//             const state = useQuery(key, queryFnUnsuccess, { retry: false, staleTime: 2000 })
//             states.push(state)
//             return (<>
//                 <div>Status:{state.status}</div>
//                 <button onClick={() => { state.refetch() }}>Refetch</button>
//             </>)
//         }
//         const rendered = render(<Page />)
//         await rendered.findByText('Status:error')
//         expect(queryCount).toEqual(1)
//         expect(states.length).toEqual(2)
//         await userEvent.click(screen.getByText('Refetch'))
//         await rendered.findByText('Status:error')
//         expect(queryCount).toEqual(2)
//         expect(states.length).toEqual(4)
//         expect(states[0]).toEqual({
//             data: undefined,
//             status: 'loading',
//             fetchStatus: 'fetching',
//             error: null,
//             isStale: expect.any(Function),
//             refetch: expect.any(Function),
//             remove: expect.any(Function),
//         })
//         expect(states[1]).toEqual({
//             data: undefined,
//             status: 'error',
//             fetchStatus: 'idle',
//             error: 'rejected',
//             isStale: expect.any(Function),
//             refetch: expect.any(Function),
//             remove: expect.any(Function),
//         })
//         expect(states[2]).toEqual({
//             data: undefined,
//             status: 'loading',
//             fetchStatus: 'fetching',
//             error: 'rejected',
//             isStale: expect.any(Function),
//             refetch: expect.any(Function),
//             remove: expect.any(Function),
//         })
//         expect(states[3]).toEqual({
//             data: undefined,
//             status: 'error',
//             fetchStatus: 'idle',
//             error: 'rejected',
//             isStale: expect.any(Function),
//             refetch: expect.any(Function),
//             remove: expect.any(Function),
//         })
//     })
//     it('手动执行refetch后,执行success回调', async () => {
//         const key = ['queryKey_1']
//         const states: any[] = []
//         const onSuccess = jest.fn()
//         function Page() {
//             const state = useQuery(key, queryFnSuccess, { onSuccess, staleTime: 2000 })
//             states.push(state)
//             return (<>
//                 <div>Status:{state.status}</div>
//                 <button onClick={() => { state.refetch() }}>Refetch</button>
//             </>)
//         }
//         const rendered = render(<Page />)
//         await rendered.findByText('Status:success')
//         expect(onSuccess).toHaveBeenCalledTimes(1)
//         expect(onSuccess).toHaveBeenCalledWith('testData')
//         await userEvent.click(screen.getByText('Refetch'))
//         await rendered.findByText('Status:success')
//         expect(onSuccess).toHaveBeenCalledTimes(2)
//         expect(onSuccess).toHaveBeenCalledWith('testData')
//     })
//     it('手动执行refetch后,执行fail回调', async () => {
//         const key = ['queryKey_1']
//         const states: any[] = []
//         const onFail = jest.fn()
//         function Page() {
//             const state = useQuery(key, queryFnUnsuccess, { onFail, retry: 1, staleTime: 2000 })
//             states.push(state)
//             return (<>
//                 <div>Status:{state.status}</div>
//                 <button onClick={() => { state.refetch() }}>Refetch</button>
//             </>)
//         }
//         const rendered = render(<Page />)
//         await rendered.findByText('Status:error')
//         expect(onFail).toHaveBeenCalledTimes(1)
//         await userEvent.click(screen.getByText('Refetch'))
//         await rendered.findByText('Status:error')
//         expect(onFail).toHaveBeenCalledTimes(2)
//     })
//     it('手动执行refetch后,执行error回调', async () => {
//         const key = ['queryKey_1']
//         const states: any[] = []
//         const onError = jest.fn()
//         function Page() {
//             const state = useQuery(key, queryFnUnsuccess, { onError, retry: false, staleTime: 2000 })
//             states.push(state)
//             return (<>
//                 <div>Status:{state.status}</div>
//                 <button onClick={() => { state.refetch() }}>Refetch</button>
//             </>)
//         }
//         const rendered = render(<Page />)
//         await rendered.findByText('Status:error')
//         expect(onError).toHaveBeenCalledTimes(1)
//         expect(onError).toHaveBeenCalledWith('rejected')
//         await userEvent.click(screen.getByText('Refetch'))
//         await rendered.findByText('Status:error')
//         expect(onError).toHaveBeenCalledTimes(2)
//         expect(onError).toHaveBeenCalledWith('rejected')
//     })
// })
// const needUsedState = ["a", "b", "c"]
// const { a, b, c } = store.useState(...needUsedState)

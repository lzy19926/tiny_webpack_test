import React from 'react';
import ReactDOM from 'react-dom/client';
import { useImperativeHandle, useRef, forwardRef } from 'react';
import './index.css'


function App() {
  const ref = useRef(null);
  const ref2 = useRef(null)

  const MyInput = forwardRef(function MyInput(props, ref) {

    useImperativeHandle(ref, () => {
      return {
        foo: () => { },
        bar: () => { },
        focus: () => { }
      };
    }, []);

    return <input {...props} ref={ref} />;
  });

  const MyInput2 = ({ ref }) => {
    return <input ref={ref} />
  }

  return (
    <div>
      <MyInput ref={ref} />   {/* 使用forwardRef包裹的组件可以传递ref,供上层调用*/}
      <button onClick={() => { console.log(ref) }}> Focus </button>

      <MyInput2 />   {/* 普通的函数式组件不能传递ref属性 【报错】 */}
      <button onClick={() => { ref2.current.focus() }}> Focus2 </button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
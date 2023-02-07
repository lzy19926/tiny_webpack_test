/*
 * @Description:
 * @Date: 2023-01-31 13:26:50
 */

import { config } from "process"

const useRef = () => { }
const createElement = () => { }

// type Mapper<T> = (currentItem: T, index: number) => React.ReactNode

// type DirectiveChildren<T> = Mapper<T> | React.ReactNode

// interface DirectiveProps<T = undefined> {
//   children?: T extends undefined ? React.ReactNode : DirectiveChildren<T>
//   is?: 'x-click' | 'x-after' | 'x-hide' | 'default'
// }

// const elements = [
//   'a',
//   'abbr',
//   'address',
//   'area',
//   'article',
//   'aside',
//   'audio',
//   'b',
//   'base',
//   'bdi',
//   'bdo',
//   'big',
//   'blockquote',
//   'body',
//   'br',
//   'button',
//   'canvas',
//   'caption',
//   'cite',
//   'code',
//   'col',
//   'colgroup',
//   'data',
//   'datalist',
//   'dd',
//   'del',
//   'details',
//   'dfn',
//   'dialog',
//   'div',
//   'dl',
//   'dt',
//   'em',
//   'embed',
//   'fieldset',
//   'figcaption',
//   'figure',
//   'footer',
//   'form',
//   'h1',
//   'h2',
//   'h3',
//   'h4',
//   'h5',
//   'h6',
//   'head',
//   'header',
//   'hgroup',
//   'hr',
//   'html',
//   'i',
//   'iframe',
//   'img',
//   'input',
//   'ins',
//   'kbd',
//   'keygen',
//   'label',
//   'legend',
//   'li',
//   'link',
//   'main',
//   'map',
//   'mark',
//   'menu',
//   'menuitem',
//   'meta',
//   'meter',
//   'nav',
//   'noscript',
//   'object',
//   'ol',
//   'optgroup',
//   'option',
//   'output',
//   'p',
//   'param',
//   'picture',
//   'pre',
//   'progress',
//   'q',
//   'rp',
//   'rt',
//   'ruby',
//   's',
//   'samp',
//   'script',
//   'section',
//   'select',
//   'small',
//   'source',
//   'span',
//   'strong',
//   'style',
//   'sub',
//   'summary',
//   'sup',
//   'table',
//   'tbody',
//   'td',
//   'textarea',
//   'tfoot',
//   'th',
//   'thead',
//   'time',
//   'title',
//   'tr',
//   'track',
//   'u',
//   'ul',
//   'use',
//   'var',
//   'video',
//   'wbr',
//   'circle',
//   'clipPath',
//   'defs',
//   'ellipse',
//   'foreignObject',
//   'g',
//   'image',
//   'line',
//   'linearGradient',
//   'marker',
//   'mask',
//   'path',
//   'pattern',
//   'polygon',
//   'polyline',
//   'radialGradient',
//   'rect',
//   'stop',
//   'svg',
//   'text',
//   'tspan',
// ] as const

// const createDirective = <T extends keyof JSX.IntrinsicElements>(component: T) => {
//   type DirProps<V = undefined> = DirectiveProps<V>
//   const deireciveComponent = <V = undefined>({
//     children,
//     is = 'default',
//     ...props
//   }: DirProps<V>): React.ReactElement | null => {
//     const ref = useRef<JSX.IntrinsicElements[T]>(null)
//     console.log(ref, props)
//     if (is === 'x-click')
//       console.log(ref)

//     return createElement(component, { ...props, ref }, children as React.ReactNode)
//   }
//   return deireciveComponent
// }

// type DirectiveMap = {
//   [Key in keyof JSX.IntrinsicElements]: ReturnType<typeof createDirective<Key>>;
// }

// const directive = {} as DirectiveMap

// elements.forEach((element) => {
//   directive[element] = createDirective(element)
// })

// export default directive




const Directive = () => {

  const ref = useRef()
  // 初始化组件
  const elements = ['Div', 'H5']

  const Container = () => <Fragment></Fragment>

  elements.forEach(tag => {
    Container[tag] = createElement(tag, {...props,ref},children)
  })

  return Container
}



// useage
<Directive.H5></Directive.H5>

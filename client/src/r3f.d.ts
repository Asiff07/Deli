declare global {
  namespace React.JSX {
    interface IntrinsicElements extends import('@react-three/fiber').ReactThreeFiber.IntrinsicElements {}
  }
}
export {};

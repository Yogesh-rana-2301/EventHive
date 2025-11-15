declare module '*.tsx' {
  const component: React.ComponentType<any>
  export = component
}

declare module '*.ts' {
  const content: any
  export = content
}
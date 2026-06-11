declare module "dom-to-image-more" {
  interface Options {
    scale?: number;
    bgcolor?: string;
    width?: number;
    height?: number;
    style?: Partial<CSSStyleDeclaration>;
    filter?: (node: Node) => boolean;
    imagePlaceholder?: string;
    cacheBust?: boolean;
    useCredentials?: boolean;
  }
  const domtoimage: {
    toPng(node: Node, options?: Options): Promise<string>;
    toJpeg(node: Node, options?: Options): Promise<string>;
    toBlob(node: Node, options?: Options): Promise<Blob>;
    toSvg(node: Node, options?: Options): Promise<string>;
  };
  export = domtoimage;
}

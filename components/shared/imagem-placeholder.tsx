import Image, { ImageProps } from "next/image";

type ImagemPlaceholderProps = Omit<ImageProps, "unoptimized">;

export function ImagemPlaceholder(props: ImagemPlaceholderProps) {
  return <Image {...props} unoptimized />;
}

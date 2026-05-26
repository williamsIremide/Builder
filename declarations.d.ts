declare module "*.mp4" {
  const src: string;
  export default src;
}

declare module "*.mkv" {
  const src: string;
  export default src;
}

declare module "*.mp3" {
  const src: string;
  export default src;
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.glb" {
  const content: string;
  export default content;
}

declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "leaflet-defaulticon-compatibility";

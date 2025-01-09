export default (name: string) =>
  new URL(`../assets/images/icons/${name}`, import.meta.url).href;

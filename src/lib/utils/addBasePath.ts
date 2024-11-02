import { base } from "$app/paths";

export function addBasePath(path : string){
    return `${base}/${path}`;
}
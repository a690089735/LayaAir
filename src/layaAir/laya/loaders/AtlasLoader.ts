import { IResourceLoader, ILoadTask, Loader } from "../net/Loader";
import { AtlasResource } from "../resource/AtlasResource";
import { Texture } from "../resource/Texture";
import { Browser } from "../utils/Browser";
import { Utils } from "../utils/Utils";

class AtlasLoader implements IResourceLoader {
    load(task: ILoadTask) {
        return task.loader.fetch(task.url, "json", task.progress.createCallback(0.2), task.options).then(data => {
            if (!data)
                return null;

            let toloadPics: Array<Promise<any>> = [];
            //构造加载图片信息
            if (data.meta && data.meta.image) {
                //带图片信息的类型
                let pics: Array<string> = data.meta.image.split(",");
                let split: string = task.url.indexOf("/") >= 0 ? "/" : "\\";
                let idx: number = task.url.lastIndexOf(split);
                let folderPath: string = idx >= 0 ? task.url.substring(0, idx + 1) : "";
                let changeType: string | null = null;

                if (Browser.onAndroid && data.meta.compressTextureAndroid) {
                    changeType = "ktx";
                }

                if (Browser.onIOS && data.meta.compressTextureIOS) {
                    if (data.meta.astc) {
                        changeType = "ktx";
                    } else {
                        changeType = "pvr";
                    }
                }

                let len = pics.length;
                for (let i = 0; i < len; i++) {
                    if (changeType) {
                        toloadPics.push(task.loader.load(Utils.replaceFileExtension(folderPath + pics[i], changeType), null, task.progress.createCallback()));
                    } else {
                        toloadPics.push(task.loader.load(folderPath + pics[i], null, task.progress.createCallback()));
                    }

                }
            } else {  //不带图片信息
                toloadPics.push(task.loader.load(Utils.replaceFileExtension(task.url, "png"), null, task.progress.createCallback()));
            }

            return Promise.all(toloadPics).then(pics => {
                let frames: any = data.frames;
                let directory: string = (data.meta && data.meta.prefix) ? data.meta.prefix : task.url.substring(0, task.url.lastIndexOf(".")) + "/";
                let urls: Array<string> = [];

                let scaleRate: number = 1;

                if (data.meta && data.meta.scale && data.meta.scale != 1) {
                    scaleRate = parseFloat(data.meta.scale);
                    for (let name in frames) {
                        let obj: any = frames[name];
                        let index = obj.frame.idx ? obj.frame.idx : 0;
                        let tPic = pics[index];
                        if (!tPic)
                            continue;

                        let url = directory + name;
                        tPic.scaleRate = scaleRate;
                        let tTexture = Texture.create(tPic, obj.frame.x, obj.frame.y, obj.frame.w, obj.frame.h, obj.spriteSourceSize.x, obj.spriteSourceSize.y, obj.sourceSize.w, obj.sourceSize.h);
                        task.loader.cacheRes(url, tTexture);
                        tTexture.url = url;
                        urls.push(url);
                    }
                } else {
                    for (let name in frames) {
                        let obj = frames[name];//取对应的图
                        let tPic = pics[obj.frame.idx ? obj.frame.idx : 0];//是否释放
                        if (!tPic)
                            continue;

                        let url = directory + name;
                        let tTexture = Texture.create(tPic, obj.frame.x, obj.frame.y, obj.frame.w, obj.frame.h, obj.spriteSourceSize.x, obj.spriteSourceSize.y, obj.sourceSize.w, obj.sourceSize.h);
                        task.loader.cacheRes(url, tTexture);
                        tTexture.url = url;
                        urls.push(url);
                    }
                }

                return new AtlasResource(directory, pics, urls);
            });
        });
    }
}

Loader.registerLoader(["atlas"], AtlasLoader, Loader.ATLAS);
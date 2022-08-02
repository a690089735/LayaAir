import { Node } from "../display/Node";
import { Resource } from "./Resource";

export class HierarchyResource extends Resource {
    protected _deps: Array<Resource>;

    constructor() {
        super();

        this._deps = [];
    }

    createScene(options?: Record<string, any>, errors?: Array<any>): Array<Node> {
        let ret = this.createNodes(options);
        if (ret)
            return [ret];
        else
            return null;
    }

    createNodes(options?: Record<string, any>, errors?: Array<any>): Node {
        return null;
    }

    addDep(res: Resource) {
        if (res instanceof Resource) {
            res._addReference();
            this._deps.push(res);
        }
    }

    addDeps(resArr: Array<Resource>) {
        for (let res of resArr) {
            if (res instanceof Resource) {
                res._addReference();
                this._deps.push(res);
            }
        }
    }

    protected _disposeResource(): void {
        for (let res of this._deps)
            res._removeReference();
    }
}
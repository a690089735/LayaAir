import { IClone } from "./IClone";
/**
 * 动画权重模式
 */
 export enum WeightedMode {
	
	
	/**仅深度。*/
	None = 0,
	/**天空。*/
	In = 1,
	/**不清除。*/
	Out = 2,
	/**固定颜色。*/
	Both = 3,
}
/**
 * <code>KeyFrame</code> 类用于创建关键帧实例。
 */
export class Keyframe implements IClone {
	static defaultWeight:number = 0.33333;
	/**时间。*/
	time: number;

	/**
	 * 创建一个 <code>KeyFrame</code> 实例。
	 */
	constructor() {

	}

	/**
	 * 克隆。
	 * @param	destObject 克隆源。
	 */
	cloneTo(destObject: any): void {
		var destKeyFrame: Keyframe = (<Keyframe>destObject);
		destKeyFrame.time = this.time;
	}

	/**
	 * 克隆。
	 * @return	 克隆副本。
	 */
	clone(): any {
		var dest: Keyframe = new Keyframe();
		this.cloneTo(dest);
		return dest;
	}

}



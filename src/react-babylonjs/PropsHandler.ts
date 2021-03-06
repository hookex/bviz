import { Vector3, Color3, Color4 } from '@babylonjs/core/Maths/math'
import { Control } from '@babylonjs/gui/2D/controls/control'
import { Observable, FresnelParameters, BaseTexture, Nullable } from '@babylonjs/core'
import { type } from 'os'
import {isEqual} from "./utils/property.unit";

// TODO: type/value need to be joined, as the method will have multiple.
export interface PropertyUpdate {
  type: string
  value: any
  propertyName: string,
  changeType: PropChangeType,
  /**
   * When provided will dynamically target a property of 'babylonJSobject'.
   */
  target?: string
}

export type UpdatePayload = PropertyUpdate[] | null

export interface PropsHandler<U> {
  getPropertyUpdates(oldProps: U, newProps: U): UpdatePayload
}

export interface HasPropsHandlers<U> {
  getPropsHandlers(): PropsHandler<U>[]
  addPropsHandler(propHandler: PropsHandler<U>): void
}

export type PropertyUpdateProcessResult<T> = {
  processed: boolean,
  value: Nullable<T>
}

/**
 * NOTE: the applyAnimatedValues from react-spring always has `oldProp` undefined, so we force set anything provided.
 * Would be more efficient to only handle the props passed in.
 */
export interface ICustomPropsHandler<T, U> {
  propChangeType: string

  /**
   * Like a visitor, except if 'true' is returned the call chain is broken.
   * So, if you want to override a 'Vector3' with a string and the type is string
   * then the regular handler will be bypassed.
   * @param propChangeType
   */
  accept(newProp: T): boolean

  // Check old vs new and return proper value, if any.
  process(oldProp: T | undefined, newProp: T): PropertyUpdateProcessResult<U>

}

export class CustomPropsHandler {

  private static _registeredPropsHandlers: Record<string, ICustomPropsHandler<any, any>[]> = {};

  /**
   *
   * @param handler
   */
  public static RegisterPropsHandler(propsHandler: ICustomPropsHandler<any, any>): void {
    const propsChangeType: string = propsHandler.propChangeType;

    if (!Array.isArray(CustomPropsHandler._registeredPropsHandlers[propsChangeType])) {
      CustomPropsHandler._registeredPropsHandlers[propsChangeType] = [];
    }

    const registeredHandlers: ICustomPropsHandler<any, any>[] = CustomPropsHandler._registeredPropsHandlers[propsChangeType];

    const match = registeredHandlers.forEach(h => h === propsHandler);
    if (match !== undefined) {
      console.error(`Handler can only be registered once per type [${propsChangeType}]`);
      return;
    }

    registeredHandlers.push(propsHandler);
  }

  public static HandlePropsChange(propsChangeType: PropChangeType, oldProp: any, newProp: any): PropertyUpdateProcessResult<any> {
    const registeredHandlers: ICustomPropsHandler<any, any>[] = CustomPropsHandler._registeredPropsHandlers[propsChangeType];
    const notProcessed: PropertyUpdateProcessResult<any> = { processed: false, value: null};
    if (registeredHandlers === undefined) {
      return notProcessed;
    }

    for (const handler of registeredHandlers) {
      if (handler.accept(newProp)) {
        const propertyUpdatedProcessResult: PropertyUpdateProcessResult<any> = handler.process(oldProp, newProp);
        // console.log('custom property processing result:', propertyUpdatedProcessResult);
        return propertyUpdatedProcessResult;
      }
    }

    return notProcessed;
  }
}

export enum PropChangeType {
  Primitive = "Primitive",
  Vector3 = "Vector3",
  Color3 = "Color3",
  Color4 = "Color4",
  Control = "Control",
  NumericArray = "NumericArray",
  Observable = "Observable",
  Method = "Method",
  LambdaExpression = "LambdaExpression",
  FresnelParameters = "FresnelParameters",
  Texture = "Texture"
}

const handledCustomProp = (changeType: PropChangeType, oldProp: any, newProp: any, propertyName: string, propertyType: string, changedProps: PropertyUpdate[]): boolean => {
  const processedResult = CustomPropsHandler.HandlePropsChange(changeType, oldProp, newProp);
  if (processedResult.processed) {
    // console.log(`handled ${PropChangeType.Color3} on ${propertyName} - bypassing built-in handler - new Value: ${JSON.stringify(processedResult.value ?? {})}`);
    changedProps.push({
      propertyName,
      type: propertyType,
      changeType,
      value: processedResult.value!
    })
  }
  return processedResult.processed;
}

export const checkVector3Diff = (oldProp: Vector3 | undefined, newProp: Vector3 | undefined, propertyName: string, propertyType: string, changedProps: PropertyUpdate[]): void => {
  if (handledCustomProp(PropChangeType.Vector3, oldProp, newProp, propertyName, propertyType, changedProps)) {
    return;
  }

  if (newProp && (!oldProp || isEqual(newProp, oldProp))) {
    changedProps.push({
      propertyName,
      type: propertyType,
      changeType: PropChangeType.Vector3,
      value: newProp
    })
  }
}

export const checkColor3Diff = (oldProp: Color3 | undefined, newProp: Color3 | undefined, propertyName: string, propertyType: string, changedProps: PropertyUpdate[]): void => {
  // console.log(`> checkColor3Diff .${propertyName}: ${JSON.stringify(oldProp)} -> ${JSON.stringify(newProp)}`)
  if (handledCustomProp(PropChangeType.Color3, oldProp, newProp, propertyName, propertyType, changedProps)) {
    return;
  }

  if (newProp && (!oldProp || isEqual(newProp, oldProp))) {
    changedProps.push({
      propertyName,
      type: propertyType,
      changeType: PropChangeType.Color3,
      value: newProp
    })
  }
}

export const checkColor4Diff = (oldProp: Color4 | undefined, newProp: Color4 | undefined, propertyName: string, propertyType: string, changedProps: PropertyUpdate[]): void => {
  if (handledCustomProp(PropChangeType.Color4, oldProp, newProp, propertyName, propertyType, changedProps)) {
    return;
  }

  // Color4.equals() not added until PR #5517
  if (newProp && (!oldProp || oldProp.r !== newProp.r || oldProp.g !== newProp.g || oldProp.b !== newProp.b || oldProp.a !== newProp.a)) {
    changedProps.push({
      propertyName,
      type: propertyType,
      changeType: PropChangeType.Color4,
      value: newProp
    })
  }
}

export const checkFresnelParametersDiff = (oldProp: FresnelParameters | undefined, newProp: FresnelParameters | undefined, propertyName: string, propertyType: string, changedProps: PropertyUpdate[]): void => {
  if (handledCustomProp(PropChangeType.FresnelParameters, oldProp, newProp, propertyName, propertyType, changedProps)) {
    return;
  }

  // FresnelParameters.equals() not added until PR #7818 (https://github.com/BabylonJS/Babylon.js/pull/7818)
  if (newProp /* won't clear the property value */ && (
      !oldProp ||
      oldProp.bias !== newProp.bias ||
      oldProp.power !== newProp.power ||
      (!oldProp.leftColor || !oldProp.leftColor.equals(newProp.leftColor)) ||
      (!oldProp.rightColor || !oldProp.rightColor.equals(newProp.rightColor)) ||
      oldProp.isEnabled !== newProp.isEnabled
      )
  ) {
    changedProps.push({
      propertyName,
      type: propertyType,
      changeType: PropChangeType.FresnelParameters,
      value: newProp
    })
  }
}

export const checkLambdaDiff = (oldProp: any | undefined, newProp: any | undefined, propertyName: string, propertyType: string, changedProps: PropertyUpdate[]): void => {
  if (newProp !== oldProp) {
    changedProps.push({
      propertyName,
      type: propertyType,
      changeType: PropChangeType.LambdaExpression,
      value: newProp
    })
  }
}

export const checkControlDiff = (oldProp: Control | undefined, newProp: Control | undefined, propertyName: string, propertyType: string, changedProps: PropertyUpdate[]): void => {
  // only sets once
  if (newProp && !oldProp) {
    changedProps.push({
      propertyName,
      type: propertyType,
      changeType: PropChangeType.Control,
      value: newProp
    })
  }
}

export type PrimitiveType = string | number | undefined | null | boolean;

export const checkPrimitiveDiff = (oldProp: PrimitiveType, newProp: PrimitiveType, propertyName: string, propertyType: string, changedProps: PropertyUpdate[]): void => {
  if (newProp !== oldProp) {
    changedProps.push({
      propertyName,
      type: propertyType,
      changeType: PropChangeType.Primitive,
      value: newProp
    })
  }
}

export const checkTextureDiff = (oldProp: BaseTexture | undefined, newProp: BaseTexture | undefined, propertyName: string, propertyType: string, changedProps: PropertyUpdate[]): void => {
  if (newProp !== oldProp) {
    console.log('pushing texture:', propertyName, propertyType)
    changedProps.push({
      propertyName,
      type: propertyType,
      changeType: PropChangeType.Texture,
      value: newProp
    })
  }
}

export const checkNumericArrayDiff = (oldProp: number[] | undefined, newProp: number[] | undefined, propertyName: string, propertyType: string, changedProps: PropertyUpdate[]): void => {
  // just length - missing loop + indexOf comparison (or deepEquals())
  if (newProp && (!oldProp || oldProp.length !== newProp.length)) {
    changedProps.push({
      propertyName,
      type: propertyType,
      changeType: PropChangeType.NumericArray,
      value: newProp
    })
  }
}

export const checkObservableDiff = (oldProp: Observable<any>, newProp: Observable<any>, propertyName: string, propertyType: string, changedProps: PropertyUpdate[]): void => {
  // if it starts with 'on' then we have different handling.
  if (oldProp === undefined && oldProp !== newProp) {
    changedProps.push({
      propertyName,
      type: propertyType,
      changeType: PropChangeType.Observable,
      value: newProp
    })
  }
}

/**
 * This method differs from the rest in that we need to pass in a list of arguments.  Can be done by using:
 * 1. an array to signify each parameter (or Object.values(...)).
 *
 * @param oldProp value of method (array, object, primitive, etc.)
 * @param newProp value of method (array, object, primitive, etc.)
 * @param propertyName name of property for diff
 * @param propertyType signature of method (as string)
 * @param changedProps list to append to when a diff is found
 */
export const checkMethodDiff = (oldProp: any, newProp: any, propertyName: string, propertyType: string, changedProps: PropertyUpdate[]): void => {
  if (oldProp !== newProp) {
    changedProps.push({
      propertyName,
      type: propertyType,
      changeType: PropChangeType.Method,
      value: newProp
    })
  }
}

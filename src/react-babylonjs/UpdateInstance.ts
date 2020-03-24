import {Color3, Color4, Scene, Vector3} from '@babylonjs/core'
import {PropChangeType, PropertyUpdate, PropsHandler} from "./PropsHandler"
import {CreatedInstance} from "./CreatedInstance"
import {debuglog} from "util";

export const applyUpdateToInstance = (hostInstance: any, update: PropertyUpdate, type?: string | undefined): void => {
  let target = update.target !== undefined ? hostInstance[update.target] : hostInstance

  switch (update.changeType) {
    case PropChangeType.Primitive:
    case PropChangeType.FresnelParameters:
    case PropChangeType.LambdaExpression:
    case PropChangeType.Texture:
      // console.log(` > ${type}: updating ${update.type} on ${update.propertyName} to ${update.value}`)
      target[update.propertyName] = update.value;
      break;
    case PropChangeType.Vector3: {
      let {value} = update;

      /**
       * spring can't interpolate custom Object(Vector3, Color3)
       */
      if (Array.isArray(value)) {
        value = Vector3.FromArray(value);
      }

      if (target[update.propertyName]) {
        (target[update.propertyName] as Vector3).copyFrom(value);
      } else if (value) {
        target[update.propertyName] = value.clone();
      } else {
        target[update.propertyName] = value; // ie: undefined/null?
      }
      break
    }

    case PropChangeType.Color3:
    case PropChangeType.Color4:
      if (target[update.propertyName]) {
        switch (update.changeType) {
          case PropChangeType.Color3:
              debugger
            (target[update.propertyName] as Color3).copyFrom(update.value);
            break;
          case PropChangeType.Color4:
            (target[update.propertyName] as Color4).copyFrom(update.value);
            break;
        }
      } else if (update.value) {
        target[update.propertyName] = update.value.clone();
      } else {
        target[update.propertyName] = update.value;
      }
      break
    case PropChangeType.Control:
      target[update.propertyName] = update.value;
      break;
    case PropChangeType.NumericArray:
      target[update.propertyName] = update.value;
      break;
    case PropChangeType.Observable:
      target[update.propertyName].add(update.value);
      break;
    case PropChangeType.Method:
      if (typeof target[update.propertyName] === "function") {
        if (Array.isArray(update.value)) {
          target[update.propertyName](...update.value)
        } else if (Object(update.value) !== update.value) {
          // primitive, undefined & null.  Comparison is 7x slower than instanceof check,
          // TODO: should be: update.value === undefined || typeof(update.value) === 'number' || ...
          target[update.propertyName](update.value)
        } else {
          // TODO: there is a bug here in that setTarget={new Vector3(0, 1, 0)} will throw an exception...
          console.error('need to make sure this isn\'t something like a Vector3 before destructuring')
          target[update.propertyName](...Object.values(update.value))
        }
      } else {
        console.error(`Cannot call [not a function] ${update.propertyName}(...) on:`, update.type, target)
      }
      break;
    default:
      console.error(`Unhandled property update of type ${update.changeType} -> ${update.type}`);
      break;
  }
}

/**
 * Only applied in this way immediately after instantiation (not on deltas)
 * TODO: deltas, called by react-spring for updating props
 * @param instance
 * @param props
 * @param scene
 */
export const applyInitialPropsToInstance = (instance: CreatedInstance<any>, props: any, scene?: Scene) => {
  if (!instance.propsHandlers) {
    return;
  }

  let initPayload: PropertyUpdate[] = []
  instance.propsHandlers.getPropsHandlers().forEach((propHandler: PropsHandler<any>) => {
    // NOTE: this can actually be WRONG, because here we want to compare the props with the object.
    // This is only needed right after object instantiation.
    let handlerUpdates: PropertyUpdate[] | null = propHandler.getPropertyUpdates(
      {}, // Here we will reapply things like 'name', so we could get default props from 'babylonObject'.
      props
    )
    if (handlerUpdates !== null) {
      initPayload.push(...handlerUpdates)
    }
  })

  if (initPayload.length > 0) {
    initPayload.forEach(update => {
      applyUpdateToInstance(instance.hostInstance, update, instance.metadata!.className)
    })
  }
}


export const applyProps = (instance: CreatedInstance<any>, props: any) => {
  if (!instance.propsHandlers) {
    return;
  }

  let initPayload: PropertyUpdate[] = []
  instance.propsHandlers.getPropsHandlers().forEach((propHandler: PropsHandler<any>) => {
    // NOTE: this can actually be WRONG, because here we want to compare the props with the object.
    // This is only needed right after object instantiation.
    let handlerUpdates: PropertyUpdate[] | null = propHandler.getPropertyUpdates(
        {}, // Here we will reapply things like 'name', so we could get default props from 'babylonObject'.
        props
    )
    if (handlerUpdates !== null) {
      initPayload.push(...handlerUpdates)
    }
  })

  if (initPayload.length > 0) {
    initPayload.forEach(update => {
      let {value} = update;

      switch (update.changeType) {
         case PropChangeType.Color3:
           if (typeof value === 'string') {
             update.value = Color3.FromArray(parseRgbaString(value));
           } else if (Array.isArray(value)) {
             update.value = Color3.FromArray(value);
           }
           break;
         case PropChangeType.Color4:
          if (typeof value === 'string') {
              update.value = Color4.FromArray(parseRgbaString(value));
          }
           break;
         case PropChangeType.Vector3:

           break;
       }

      applyUpdateToInstance(instance.hostInstance, update, instance.metadata!.className)
    })
  }
};

function parseRgbaString(rgba: string): number[] {
  const arr:string[] = rgba.replace(/[^\d,]/g, '').split(',');
  return arr.map(num => parseInt(num, 10) / 255);
};

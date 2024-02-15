/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tracer } from '@aws-lambda-powertools/tracer';
import { isAsyncFunction } from 'util/types';

export const tracer = new Tracer();

export type StaticClassTraceConfig = {
  exclude?: string[];
};

export function StaticClassTrace(
  config?: StaticClassTraceConfig,
): ClassDecorator {
  return function (target: any) {
    const members = Object.getOwnPropertyNames(target)
      .filter(
        (member) =>
          (config?.exclude && config?.exclude?.includes(member) === false) ||
          !config?.exclude,
      )
      .filter((member) => typeof target[member] === 'function');

    for (const member of members) {
      const descriptor = Object.getOwnPropertyDescriptor(
        target,
        member,
      ) as PropertyDescriptor;
      if (isAsyncFunction(descriptor.value)) {
        target[member] = tracer.captureMethod({
          subSegmentName: `${target.name}.${member}`,
          captureResponse: false,
        })(target, member, descriptor).value;
      }
    }
  };
}

type ArgumentTypes<T> = T extends (...args: infer U) => any ? U : never;

export type MethodTraceOptions<T, Args> = {
  name?: string | ((instance: T, ...args: ArgumentTypes<Args>) => string);
  captureResponse?: boolean;
};

export function MethodTrace<
  T extends object,
  Args extends (...args: any[]) => unknown,
>(options?: MethodTraceOptions<T, Args>) {
  return function (
    target: T,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<Args>,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const originalMethod = descriptor.value!;
    const methodName = String(propertyKey);

    if (isAsyncFunction(descriptor.value)) {
      descriptor.value = async function (
        this: T,
        ...args: ArgumentTypes<Args>
      ) {
        const subSegmentName = options?.name
          ? typeof options.name === 'function'
            ? options.name.apply(this, [this, ...args])
            : options.name
          : `${target.constructor.name}.${methodName}`;

        return tracer.provider.captureAsyncFunc(
          subSegmentName,
          async (subsegment) => {
            let result;
            try {
              result = await originalMethod.apply(this, [...args]);
              if (options?.captureResponse ?? false) {
                tracer.addResponseAsMetadata(result, methodName);
              }
            } catch (error) {
              tracer.addErrorAsMetadata(error as Error);

              throw error;
            } finally {
              try {
                subsegment?.close();
              } catch (error) {
                console.warn(
                  `Failed to close or serialize segment %s. We are catching the error but data might be lost.`,
                  subsegment?.name,
                  error,
                );
              }
            }

            return result;
          },
        );
      } as never;
    }

    return descriptor;
  };
}

export type FunctionTraceOptions<Args extends any[]> = {
  name: string | ((...args: Args) => string);
  captureResponse?: boolean;
};

export const functionTraceDecorator = <Args extends any[], TResult>(
  options: FunctionTraceOptions<Args>,
  innerFunction: (...args: Args) => Promise<TResult>,
) => {
  return async function (...args: Args): Promise<TResult> {
    const subSegmentName =
      typeof options.name === 'function' ? options.name(...args) : options.name;

    return (await tracer.provider.captureAsyncFunc(
      subSegmentName,
      async (subsegment) => {
        let result;
        try {
          result = await innerFunction(...args);
          if (options?.captureResponse ?? false) {
            tracer.addResponseAsMetadata(result);
          }
        } catch (error) {
          tracer.addErrorAsMetadata(error as Error);

          throw error;
        } finally {
          try {
            subsegment?.close();
          } catch (error) {
            console.warn(
              `Failed to close or serialize segment %s. We are catching the error but data might be lost.`,
              subsegment?.name,
              error,
            );
          }
        }

        return result;
      },
    )) as Promise<TResult>;
  };
};

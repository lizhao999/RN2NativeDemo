//
//  MyModule.m
//  RN2NativeDemo
//
//  Created by 李钊 on 2017/4/19.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "MyModule.h"

@implementation MyModule
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(addEvent:(NSString *)name location:(NSString *)location)
{
//  RCTLogInfo(@"add an event %@ at %@", name, location);
  NSLog(@"%@-%@",name,location);
}

//  对外提供调用方法,演示Callback
RCT_EXPORT_METHOD(testCallbackEvent:(NSString *)event callback:(RCTResponseSenderBlock)callback)
{
  NSLog(@"%@",event);
  NSString *callbackData = @"Callback数据"; //准备回调回去的数据
  callback(@[[NSNull null],callbackData]);
}

//Promises
//  对外提供调用方法,演示Promise使用
RCT_REMAP_METHOD(testPromisesEvent,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *PromisesData = @"Promises数据"; //准备回调回去的数据
  if (PromisesData) {
    resolve(PromisesData);
  } else {
    NSError *error=[NSError errorWithDomain:@"我是Promise回调错误信息..." code:101 userInfo:nil];
    reject(@"no_events", @"There were no events", error);
  }
}

- (NSDictionary *)constantsToExport
{
  return @{ @"ValueOne": @"我是从原生定义的~" };
}


@end

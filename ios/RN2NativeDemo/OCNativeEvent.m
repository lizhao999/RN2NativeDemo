//
//  OCNativeEvent.m
//  RN2NativeDemo
//
//  Created by 李钊 on 2017/4/19.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "OCNativeEvent.h"


@implementation OCNativeEvent
RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"showAlertCallback"];//导出你的方法，数组结构。
}

-(void)showAlertCallback:(NSString*)code result:(NSString*) result
{
  [self sendEventWithName:@"showAlertCallback"
                     body:@{
                            @"code": code,
                            @"result": result,
                            }];
}

@end

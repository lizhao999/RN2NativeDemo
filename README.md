#React Native 与 原生交互

React Native 与原生交互一般有三种方式，分别是`Callback`,`Promise`,`RCTDeviceEventEmitter`
	
本文所有代码片段基于

React Native

	"react": "16.0.0-alpha.6",
	"react-native": "0.43.3"

iOS

	Xcode 8.2.1
	iOS 10.3
##Callback 方式
优点 | 缺点
---|---
JS调用一次，Native返回一次	|CallBack为异步操作，返回时机不确定

###Native 端
创建一个`Cocoa Touch Class` 文件 继承 `RCTBridgeModule`协议

`.h`文件


	#import <React/RCTBridgeModule.h>

	@interface MyModule : NSObject<RCTBridgeModule>

	@end

`.m`文件
	
	#import "MyModule.h"

	@implementation MyModule
	//将当前对象暴露给ReactNative 可以访问
	RCT_EXPORT_MODULE();
	
	//对React Native提供调用方法,Callback
	RCT_EXPORT_METHOD(testCallbackEvent:(NSString *)event callback:(RCTResponseSenderBlock)callback)
	{
	  NSLog(@"%@",event);
	  NSString *callbackData = @"Callback数据"; //准备回调回去的数据
 	  callback(@[[NSNull null],callbackData]);
	}

Native 端通过`RCTBridgeModule`协议，使用上面的代码实现了对象、方法的声明，将自身暴露给React Native

###React Native 端
在需要使用到Native 类的js页面中。导入`NativeModules` 
	
	import NativeModules from 'react-native'
	var MyModule = NativeModules.MyModule;

在js对象中使用

    <Text style={styles.welcome} onPress={()=>this.callBackEvent()}>点击调原生+回调</Text>
    
    callBackEvent (){
        MyModule.testCallbackEvent(('RN->原生的数据'),(error, events) => {
            if (error) {
                console.error(error);
            } else {
                alert(events)//返回的数据
            }
        })
    }
    
以上是`Callback`方式。

##Promise 方式
优点 | 缺点
---|---
js调用一次，Native返回一次|每次使用需要js调用一次

###Native 端
	
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


###React Native 端

	<Text style={styles.welcome} onPress={()=>this.promisesEvent()}>Promises</Text>
	
	//Promise回调
    async promisesEvent(){
        MyModule.testPromisesEvent().then((events)=>{
            alert(events+1111)
        }).catch((e)=>{
            console.error(e);
        })
    }


##RCTDeviceEventEmitter 方式
`RCTDeviceEventEmitter` 类似于iOS中的通知`NSNotificationCenter `。
###Native 端
`.h`
	
	#import <React/RCTEventEmitter.h>
	
	@interface OCNativeEvent : RCTEventEmitter<RCTBridgeModule>
	
	@end


`.m`

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
	
###React Native 端
	
	import NativeModules from 'react-native'
	import NativeEventEmitter from 'react-native';
	
	
	componentWillMount() {
	        myNativeEvt.emit('showAlertCallback',value);
	        this.listener = myNativeEvt.addListener('showAlertCallback', this.showAlertCallback.bind(this));  //对应了原生端的名字
	    }
    
    componentWillUnmount() {
        this.listener && this.listener.remove();  //记得remove哦
        this.listener = null;
    }
    
    showAlertCallback(data) {//接受原生传过来的数据 data={code:,result:}
	    if (data.code == CB_CODE_RESULT) {
	        //
	    }
	    else {//..真的是未知的错误
	        logf('传回其他参数', data.result);
	    }
	}
	

发送消息`js`
	        			
	myNativeEvt.emit('showAlertCallback',value);
	
`native` 继承`RCTEventEmitter`
	
	[self sendEventWithName:@"showAlertCallback"
                     body:@{
                            @"code": code,
                            @"result": result,
                            }];
	  		
		



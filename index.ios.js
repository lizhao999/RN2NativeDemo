/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NativeAppEventEmitter,
  NativeEventEmitter

} from 'react-native';
import NativeModules from 'react-native'
import NativeEventEmitter from 'react-native';
var OCNativeEvent = NativeModules.OCNativeEvent;
const myNativeEvt = new NativeEventEmitter(OCNativeEvent);  //创建自定义事件接口
var MyModule = NativeModules.MyModule;

export default class RN2NativeDemo extends Component {
    componentWillMount() {
        myNativeEvt.emit('showAlertCallback',value);
      //  RCTDeviceEventEmitter.emit('showAlertCallback',value);
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
    passValueToNativeOne = ()=>{
        MyModule.addEvent('周少停','zhangssss');
    }
    callBackEvent (){
        MyModule.testCallbackEvent(('RN->原生的数据'),(error, events) => {
            if (error) {
                console.error(error);
            } else {
                alert(events)
            }
        })
    }

    //Promise回调
    async promisesEvent(){
        MyModule.testPromisesEvent().then((events)=>{
            alert(events+1111)
        }).catch((e)=>{
            console.error(e);
        })
    }
  render() {
    return (
      <View style={styles.container}>
          <Text style={styles.welcome} onPress={()=>this.passValueToNativeOne()}>点击往原生传字符串</Text>
          <Text style={styles.welcome} onPress={()=>this.callBackEvent()}>点击调原生+回调</Text>
          <Text style={styles.welcome} onPress={()=>this.promisesEvent()}>Promises</Text>

        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('RN2NativeDemo', () => RN2NativeDemo);

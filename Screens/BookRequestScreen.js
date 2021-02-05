import * as React from 'react'
import 
{View,
 Text,
 StyleSheet,
 Image,
 Button,
 TextInput,
 KeyboardAvoidingView,
}                       from 'react-native';
import {Header} from 'react-native-elements'
import db from '../config';
import firebase from 'firebase'
import {SafeAreaProvider,SafeAreaView} from 'react-native-safe-area-context'
export default class BookRequestScreen extends React.Component{
    constructor(){
        super()
      this.state={
          userId:firebase.auth().currentUser.email,
          ThingName:"",
          ReasonToRequest:"",
      }
    }
    createuniqueid(){
        return Math.random().toString(36).substring(7)
    }
    addrequest=(ThingName,ReasonToRequest)=>{
        var userId = this.state.userId
        var randomrequestId=this.createuniqueid()
        db.collection('requested_things').add({
            "userId":userId,
            "ThingName":ThingName,
            "reasontorequest":ReasonToRequest,
            "requestid":randomrequestId
        })
        this.setState({
            ThingName:'',
            ReasonToRequest:''
        })
        alert('thing Request Uploaded!')
    }
    
    render(){
        return(
            <SafeAreaProvider>
            <View>
                <Header 
                backgroundColor='orange'
                centerComponent={{text:'thing Request',style:{fontSize:50,color:'white'}}}
                leftComponent={<Icon name='menu' color='grey' onPress={()=>{this.props.navigation.toggleDrawer()}}/>}
                />
            <KeyboardAvoidingView>
                                 
                                    <TextInput
                                             style={styles.TextI}
                                             placeholder="thing Name"
                                             onChangeText={(text)=>{
                                                 this.setState({ThingName:text})
                                             }
                                          }
                                    />
                                    <TextInput
                                              style={styles.TextI}
                                              placeholder="Reason To Request"
                                              multiline={true}
                                              numberOfLines={8}
                                              onChangeText={(text)=>{
                                                  this.setState({ReasonToRequest:text})
                                              }
                                            }
                                    />
                 <Button title="Save" color="blue" onPress={()=>{this.addrequest(this.state.ThingName,this.state.ReasonToRequest)}}/>
            </KeyboardAvoidingView>
            </View>
            </SafeAreaProvider>
        )
    }
}
const styles = StyleSheet.create({
    TextI:{
      width:200,
      height:50,
      border:'solid',
      borderRadius:10
    }
})
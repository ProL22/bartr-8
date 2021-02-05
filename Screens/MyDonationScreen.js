import* as React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet
}  from 'react-native';
import MyHeader from '../Components/MyHeader';
import {Icon,ListItem} from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';
import {SafeAreaProvider,SafeAreaView} from 'react-native-safe-area-context'

export default class MyDonation extends React.Component{
    constructor(){
        super()
        this.state = {
            donorId : firebase.auth(currentUser.email),
            donorName:"",
            allDonations:[]
        }
        this.requestRef=null
    }
    static navigationOptions ={header:null};

    getDonorDetails=(donorId)=>{
        db.collection("users").where("email_id","==",donorId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc) =>{
                this.setState({
                    "donorName" : doc.data().first_name+" "+doc.data().last_name
                })
            });
        })
    }
    getAllDonations=()=>{
        this.requestRef=db.collection("all_donations").where("donorid","==",this.state.donorId)
        onSnapshot((snapshot)=>{
            var allDonations = []
                snapshot.docs.map((doc)=>{
                    var donation= doc.data()
                    donation["docid"]=doc.id
                    allDonations.push(donation)
                });
                this.setState({
                    allDonations : allDonations
                });
            
        })
    }
    sendThing=(thingDetails)=>{
        if(thingDetails.request_status === "thing Sent"){
            var requestStatus = "Donor Intrested"
            db.collection("all_donations").doc(thingDetails.doc_id).update({
                "request_status" : "Donor Intrested"
            })
            this.sendNotificaion(thingDetails,requestSataus)
        }
    else{
        var requestSatatus= "Thing Sent"
        db.collection("all_donations").doc(thingDetails.doc.id).update({
            "request_status" :"thingSent"            
        })
        this.sendNotification(thingDetails,requestSataus)
    }
  }

  sendNotificaion=(thingDetails,requestStatus)=>{
      var requestId = thingDetails.request_Id
      var donorId = thingDetails.donor_id
      db.collection("all_notifications")
      .where("requestid","==",requestId)
      .where("donor_id","==",donorId)
      .get()
      .then((snapshot)=>{
          snapshot.forEach((doc)=> {
              var message = ""
              if(requestStatus === "thing Sent"){
                  message = this.state.donorName + " sent you thing"
              }else{
                  message = this.state.donorName+ "has shown intrest"
              }
              db.collection("all_notifications").doc(doc.id).update({
                  "message": message,
                  "notification_status" : "unread",
                  "data"                :firebase.firestore.FieldValue.serverTimestamp()
              })
          })
      })
  }
    
  keyExtractor = (item,index) => index.toString()
  renderItem =( {item,i} ) =>(
    <ListItem
    key={i}
    
    title={item.thing_name}
    subtitle={"Requested By : " + item.requested_by +"\nStatus : " + item.request_status}
    leftElement={<Icon name="thing" type="font-awesome" color ='#696969'/>}
    titleStyle={{ color: 'black', fontWeight: 'bold' }}
    rightElement={
        <TouchableOpacity
         style={[
           styles.button,
           {
             backgroundColor : item.request_status === "thing Sent" ? "green" : "#ff5722"
           }
         ]}
         onPress = {()=>{
           this.sendthing(item)
         }}
        >
          <Text style={{color:'#ffff'}}>{
            item.request_status === "thing Sent" ? "thing Sent" : "Send thing"
          }</Text>
        </TouchableOpacity>
      }
    bottomDivider
  />
)
componentDidMount(){
    this.getDonorDetails(this.state.donorId)
    this.getAllDonations()
  }

  componentWillUnmount(){
    this.requestRef();
  }
  render(){
    return(
     <SafeAreaProvider>
      <View style={{flex:1}}>
        <MyHeader navigation={this.props.navigation} title="My Donations"/>
        <View style={{flex:1}}>
          {
            this.state.allDonations.length === 0
            ?(
              <View style={styles.subtitle}>
                <Text style={{ fontSize: 20}}>List of all thing Donations</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.allDonations}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
      </View>
</SafeAreaProvider>         
    )
  }
}
const styles = StyleSheet.create({
    button:{
      width:100,
      height:30,
      justifyContent:'center',
      alignItems:'center',
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8
       },
      elevation : 16
    },
    subtitle :{
      flex:1,
      fontSize: 20,
      justifyContent:'center',
      alignItems:'center'
    }
  })
  
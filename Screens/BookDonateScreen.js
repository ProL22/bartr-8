import * as React from 'react';
import 
{View, 
 StyleSheet,
 FlatList,
 Text,
 Button,
 Image
}        from 'reac-native';
import {Header,ListItem} from 'react-native-elements';
import db from '../config';
import firebase from 'firebase';
import {SafeAreaProvider,SafeAreaView} from 'react-native-safe-area-context'
export default class BookDonateScreen extends React.Component{
    constructor(){
        super()
        this.state={
            RequestedThingsList:[],

        }
        this.requestref=null
    }
    getRequestedthinglist=()=>{
        this.requestref=db.collection("requested_things").onSnapshot((snapshot)=>{
            var RequestedThingsList= snapshot.docs.map(document=>document.data())
            this.setState({
                RequestedThingsList:RequestedThingsList
            })
        })
    }
    componentDidMount(){
        this.getRequestedthinglist()
    }
    componentWillUnmount(){
        this.requestref()
    }
     keyExtractor=(item,index)=>index.toString()
     renderItem=({item,i})=>{
        return(
            <ListItem
            key={i} bottomDivider>
            <ListItem.Content>
                               <ListItem.Title>{item.ThingName}</ListItem.Title>
                               <ListItem.Subtitle>{item.ReasonToRequest}</ListItem.Subtitle>
                                                                                            <TouchableOpacity onPress={()=>{this.props.navigation.navigate("RecieverDetailsScreen",{"details":item})}}>
                                                                                                             <Text>View</Text>
                                                                                            </TouchableOpacity>


           </ListItem.Content>
            </ListItem>
        )
     }
    render(){
        return(
          <SafeAreaProvider>
            <View>
                <Header
                backgroundColor='orange'
                centerComponent={{text:'thing Donate',style:{fontSize:50}}}
                leftComponent={<Icon name='menu' color='grey' onPress={()=>{this.props.navigation.toggleDrawer()}}/>}
            
                />
                {this.state.RequestedThingsList.length===0
                ?(<Text> List of All Requested things </Text>)
                :(<FlatList
                    keyExtractor={this.keyExtractor}
                    data={this.state.RequestedThingsList}
                    renderItem={this.renderItem}
                    />)

                }
            </View>
    </SafeAreaProvider>  
        )
    }
}

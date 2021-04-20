import * as React from 'react';
import {
    ScrollView,
    Text,
    View,
    StyleSheet,
    FlatList
} from 'react-native';
import {ListItem} from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import firebase from 'firebase';
import db from '../config';

export default class Notifications extends React.Component{
    constructor(){
        super();
        this.state={
            user_id:firebase.auth().currentUser.email,
            all_notifications:[]
        }
        this.notificationRef=null
    }

    getNotification=async()=>{
        this.notificationRef = db.collection("notifications")
        .where("notification_status", "==", "unread")
        .where("targated_user_id", "==", this.state.user_id)
        .onSnapshot((snapshot)=>{
            var allNotification = []
            snapshot.docs.map((doc)=>{
                var notification = doc.data();
                notification["doc_id"] = doc.id;
                allNotification.push(notification)
            });
            this.setState({
                all_notifications : allNotification
            })
        })
    }

    componentDidMount=()=>{
        this.getNotification()
    }

    componentWillUnmount=()=>{
        this.notificationRef()
    }

    keyExtractor = (item, index)=>index.toString();

    renderItem=({item, i})=>{
        return(
            <ListItem
                key={i}
                title={item.item_name}
                titleStyle={{ color: 'black', fontWeight: 'bold' }}
                subtitle={item.message}
            ></ListItem>
        );
    }

    render(){
        return(
            <View>
                <MyHeader title="Notifications" />
                <ScrollView>
                    {
                        this.state.all_notifications.length!==0?(
                            <FlatList
                                keyExtractor={this.keyExtractor}
                                data={this.state.all_notifications}
                                renderItem={this.renderItem}
                            ></FlatList>
                        ):(
                            <View style={{alignItems:'center', marginTop:200}}>
                                <Text style={{fontSize:20}}>
                                    You have no notifications
                                </Text>
                            </View>
                        )
                    }
                </ScrollView>
            </View>
        );
    }
}
import React,{useState} from 'react';
import { StyleSheet, Text, View,Modal,Alert,KeyboardAvoidingView} from 'react-native';
import {TextInput,Button} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';


const CreateEmployee = ({navigation,route})=>{
    const getDetails = (type)=>{
        if(route.params){   
           switch(type){ 
               case "name":
                   return route.params.name
               case "phone":
                   return route.params.phone
               case "email":
                    return route.params.email
                case "salary":
                   return route.params.salary
                case "picture":
                   return route.params.picture
                case "position":
                    return route.params.position             
                }
              
        }
        return""
    }

    const [name,setName] = useState(getDetails("name"))
    const [phone,setPhone] = useState(getDetails("phone"))
    const [email,setEmail] = useState(getDetails("email"))
    const [salary,setSalary] = useState(getDetails("salary"))
    const [picture,setPicture] = useState(getDetails("picture"))
    const [position,setPosition] = useState(getDetails("position"))
    const [modal,setModal] = useState(false)
    const [enableshift,setenableShift]  = useState(false)

    const submitData = ()=>{
               fetch("http://9983fe41.ngrok.io/send-data",{
             method:"post",
              headers:{
                  'Content-Type' : 'application/json'
              },
            body:JSON.stringify({
                name,
                email,
                phone,
                salary,
                picture,
                position
            })
         })
         .then(res=>res.json())
         .then(data=>{
             Alert.alert(`${data.name}is saved successfully`)
             navigation.navigate("Home")
         }).catch(err=>{
            Alert.alert("Something went wrong")
          })
    }
     const updateDetails =()=>{
        fetch("http://9983fe41.ngrok.io/update",{
             method:"post",
              headers:{
                  'Content-Type' : 'application/json'
              },
            body:JSON.stringify({
                id:route.params._id,
                name,
                email,
                phone,
                salary,
                picture,
                position
            })
         })
         .then(res=>res.json())
         .then(data=>{
             Alert.alert(`${data.name} is updated successfully`)
             navigation.navigate("Home")
         })
         .catch(err=>{
            Alert.alert("Something went wrong")
          }) 
     }
    
    const pickFromGallery = async()=>{
        const {granted} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if(granted){
            let data = await ImagePicker.launchImageLibraryAsync({
                 mediaTypes:ImagePicker.MediaTypeOptions.Images,
                 allowsEditing:true,
                 aspect:[1,1],
                 quality:0.5
             })
             if(! data.cancelled){
                let newfile = { uri:data.uri,
                  type:`test/${data.uri.split(".")[1]}`,
                  name:`test.${data.uri.split(".")[1]}`
                              }
                      handleUpload(newfile )          
                               } 
        }
        else{
             Alert.alert("you need to give up permission to work")
             }
       }
  
       const pickFromCamera = async()=>{
        const {granted} = await Permissions.askAsync(Permissions.CAMERA)
        if(granted){
             let data = await ImagePicker.launchCameraAsync({
                 mediaTypes:ImagePicker.MediaTypeOptions.Images,
                 allowsEditing:true,
                 aspect:[1,1],
                 quality:0.5
             })
          if(! data.cancelled){
              let newfile = { uri:data.uri,
                type:`test/${data.uri.split(".")[1]}`,
                name:`test.${data.uri.split(".")[1]}`
                            }
                    handleUpload(newfile )          
                             }  

                            } else{
             Alert.alert("you need to give up permission to work")
        }
       }

       const handleUpload = (image)=>{
          const data = new FormData()   
          data.append('file',image)
          data.append('upload_preset','employeeapp')
          data.append("cloud_name","swetascloud")

          fetch("https://api.cloudinary.com/v1_1/swetascloud/image/upload",{
              method:"post",
              body:data
          }).then(res=>res.json())
          .then(data=>{
              setPicture(data.url)
              setModal(false)
          }).catch(err=>{
            Alert.alert("error while uploading")
          })
       }
return(
    <KeyboardAvoidingView behavior="position" style={styles.root} enabled={enableshift}>
    <View>
        <TextInput
            label='Name'
            style={styles.inputStyle}
            value={name}
            mode="outlined"
            theme={theme}
            onFocus={()=>setenableShift(false)}
            onChangeText={text => setName(text)}
            />
            <TextInput
            label='Email'
            style={styles.inputStyle}
            value={email}
            mode="outlined"
            theme={theme}
            onFocus={()=>setenableShift(false)}
            onChangeText={text => setEmail(text)}
            />
            <TextInput
            label='phone'
            style={styles.inputStyle}
            value={phone}
            mode="outlined"
            keyboardType="number-pad"
            theme={theme}
            onFocus={()=>setenableShift(false)}
            onChangeText={text => setPhone(text)}
            />
            <TextInput
            label='salary'
            style={styles.inputStyle}
            value={salary}
            mode="outlined"
            theme={theme}
            onFocus={()=>setenableShift(true)}
            onChangeText={text => setSalary(text)}
            />
            <TextInput
            label='position'
            style={styles.inputStyle}
            value={position}
            mode="outlined"
            theme={theme}
            onFocus={()=>setenableShift(true)}
            onChangeText={text => setPosition(text)}
            />
        
            <Button style={styles.inputStyle}
              icon={picture==""?"upload":"check"}
              mode="contained"
              theme={theme}
              onPress={() => setModal(true)}>
                Upload Image
            </Button>
            {route.params?
            <Button style={styles.inputStyle}
              icon="content-save"
              mode="contained"
              theme={theme}
              onPress={() => updateDetails()}>
                Update Details
            </Button>
            :
            <Button style={styles.inputStyle}
              icon="content-save"
              mode="contained"
              theme={theme}
              onPress={() => submitData()}>
                Save
            </Button>
            }
              
              <Modal
              animationType="slide"
              transparent={true}
              visible={modal}
              onRequestClose={()=>{
                    setModal(false)
              }}
              
              >
        <View style={styles.modalView}>
                   <View style={styles.modalButtonView}>
                     <Button icon="camera" 
                     theme={theme}
                     mode="contained" 
                     onPress={() => pickFromCamera()}>
                           Camera
                     </Button>
                     <Button icon="image-area"
                     theme={theme}
                     mode="contained" 
                      onPress={() => pickFromGallery()}>
                           Gallery
                     </Button>
                   </View>
        <Button
        theme={theme}
        onPress={()=>setModal(false)}>
            cancel
        </Button>       
        </View> 
            </Modal>
    
    </View> 
    </KeyboardAvoidingView>  
    )
}
const theme = {
    colors:{
     primary:"#00a6ff"
}
}
const styles=StyleSheet.create({
    root:{
        flex:1
    },
    inputStyle:{
        margin:6
    },
    modalView:{
        position:"absolute",
        bottom: 2,
        width:"100%",
        backgroundColor:"white"
    },
    modalButtonView:{
        flexDirection:"row",
        justifyContent:"space-around",
        padding:10
    }
})
export default CreateEmployee
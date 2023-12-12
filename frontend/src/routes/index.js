import { createNativeStackNavigator } from "@react-navigation/native-stack"

import Signin from '../pages/Signin'
import Signup from '../pages/Signup'
import Home from '../pages/Home'
import InfoBar from '../pages/InfoBar'
import Profile from '../pages/Profile'
import Favorite from '../pages/Favorite'
import Cart from "../pages/PageCart/Cart";
import Devs from '../pages/Devs'
import FinishedProducts from '../pages/Finished/FinishedProducts'
import Chat from '../pages/Chat'


const Stack = createNativeStackNavigator();
export default function Routes() {

    return (
        
        <Stack.Navigator>
            
            
            <Stack.Screen 
            name="SignIn" 
            component={Signin}
            options={{ headerShown: false}}
            
            />
            
            <Stack.Screen 
            name="SignUp" 
            component={Signup}
            options={{ headerShown: false}}
            />
            
            <Stack.Screen 
            name="Home" 
            component={Home}
            options={{ headerShown: false}}
            />
            
            <Stack.Screen
            name="Profile" 
            component={Profile}
            options={{ headerShown: false}}
            />

            <Stack.Screen
            name="InfoBar" 
            component={InfoBar}
            options={{ headerShown: false}}
            />

            <Stack.Screen
            name="Favorite" 
            component={Favorite}
            options={{ headerShown: false}}
            />

            <Stack.Screen
            name="Cart" 
            component={Cart}
            options={{ headerShown: false}}
            />

            <Stack.Screen
            name="FinishedProducts" 
            component={FinishedProducts}
            options={{ headerShown: false}}
            />
            
            <Stack.Screen
            name="Devs" 
            component={Devs}
        
            />

            <Stack.Screen
            name="Chat" 
            component={Chat}
            options={{headerTitleAlign: 'center'}}
            />

            </Stack.Navigator> 
    )
}

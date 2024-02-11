import React, { useContext } from "react";
import { View, Text, Button } from 'react-native'

import { AuthContext } from "../../contexts/AuthContext"; 

export default function Dashboard(){
    const { singOut } = useContext(AuthContext);

    return(
        <View>
            <Text>Tela de Dashboad</Text>
            <Button title="Sair do app" onPress={singOut}/>
        </View>
    )
}
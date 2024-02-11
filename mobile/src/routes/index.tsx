import React, { useContext } from "react";
import { ActivityIndicator, View } from "react-native";

import AppRoutes from "./app.routes";
import AuthRoutes from "./auth.routes";
import { AuthContext } from "../contexts/AuthContext";

function Routes() {
    const { isAuthenticated } = useContext(AuthContext);
    const loading = false;

    if (loading) {
        return (
            <View style={{
                flex: 1,
                backgroundColor: "#F5f7fb",
                justifyContent: 'center',
                alignItems: "center"
            }}>
                <ActivityIndicator size={60} color={"#1D1D2E"} />
            </View>
        )
    }
    return (
        //ternário verifica a variavel for true (usauraio logado) renderiza AppRoutes        
        isAuthenticated ? <AppRoutes /> : <AuthRoutes />
    );
}
export default Routes;
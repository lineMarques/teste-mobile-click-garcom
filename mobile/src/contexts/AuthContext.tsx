import React, { useState, createContext, ReactNode, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from "../services/api";

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    loadingAuth: boolean;
    loading: boolean;
    singOut: () => Promise<void>;
}

type UserProps = {
    Id: string;
    Nome: string;
    Email: string;
    Token: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

type SignInProps = {
    Email: string;
    Password: string;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<UserProps>({
        Id: '',
        Nome: '',
        Email: '',
        Token: '',

    });


    const [loadingAuth, setLoadingAth] = useState(false);
    const [loading, setLoading] = useState(true)
    const isAuthenticated = !!user.Nome;

    useEffect(() => {

        async function getUser() {
            //Pegar os dados salvos do user
            const userInfo = await AsyncStorage.getItem('@clickgarcom');
            console.log(userInfo);
            let hasUser: UserProps = JSON.parse(userInfo || '{}')

            if (Object.keys(hasUser).length > 0) {
                api.defaults.headers.common['Authorization'] = `Bearer ${hasUser.Token}`

                setUser({
                    Id: hasUser.Id,
                    Nome: hasUser.Nome,
                    Email: hasUser.Email,
                    Token: hasUser.Token
                })
            }
            setLoading(false);
        }

        getUser();
    }, [])

    async function signIn({ Email, Password }: SignInProps) {
        setLoadingAth(true);

        try {
            const response = await api.post('/login', {
                Email,
                Password
            })

            const data = {
                ...response.data
            }

            const { Id, Nome, Token } = response.data

            await AsyncStorage.setItem("@token", JSON.stringify(data))
            api.defaults.headers.common["Authorization"] = `Bearer ${Token}`

            setUser({
                Id,
                Nome,
                Email,
                Token
            })

            console.log('logado');
            setLoadingAth(false);

        } catch (error) {
            console.log('Erro ao logar');
            setLoadingAth(false)
        }

    }
    
    async function singOut() {
        await AsyncStorage.clear()
            .then(() => {
                setUser({
                    Id: '',
                    Nome: '',
                    Email: '',
                    Token: ''
                })
            })
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, loading, loadingAuth, singOut }} >
            {children}
        </ AuthContext.Provider>
    )
}